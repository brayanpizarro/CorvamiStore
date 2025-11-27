import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ordersApi } from '../api/orders';
import type { CreateOrderData, ProcessPaymentData } from '../api/orders';
import { FaCreditCard, FaLock, FaShippingFast, FaWallet, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clear } = useCart();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'balance'>('card');
  const [formData, setFormData] = useState({
    // Customer info
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    department: '',
    zipCode: '',
    notes: '',
    // Payment info
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, cardNumber: value }));
      if (errors.cardNumber) {
        setErrors((prev) => ({ ...prev, cardNumber: '' }));
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setFormData((prev) => ({ ...prev, expiryDate: value }));
      if (errors.expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: '' }));
      }
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, cvv: value }));
      if (errors.cvv) {
        setErrors((prev) => ({ ...prev, cvv: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.department.trim()) newErrors.department = 'El departamento es requerido';

    // Solo validar tarjeta si el usuario está autenticado y el método de pago es tarjeta
    if (isAuthenticated && paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta requerido';
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Titular requerido';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Fecha de vencimiento requerida';
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Formato inválido (MM/AA)';
      }
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV requerido';
      else if (formData.cvv.length < 3) {
        newErrors.cvv = 'CVV inválido';
      }
    } else if (isAuthenticated && paymentMethod === 'balance') {
      // Validar que el usuario tenga saldo suficiente
      if (user && user.balance < total) {
        newErrors.payment = `Saldo insuficiente. Tienes ${formatPrice(user.balance)} y necesitas ${formatPrice(total)}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Preparar datos de la orden
      const orderData: CreateOrderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          department: formData.department,
          zipCode: formData.zipCode,
          isGuest: !user,
          userId: user?.userId,
        },
        items: (cart?.items || []).map((item) => ({
          productId: item.productId,
          name: item.name || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice || item.price || 0,
          totalPrice: (item.unitPrice || item.price || 0) * item.quantity,
          image: item.image,
        })),
        subtotal: cart?.totalPrice || 0,
        shipping: (cart?.totalPrice || 0) > 200000 ? 0 : 15000,
        total: (cart?.totalPrice || 0) + ((cart?.totalPrice || 0) > 200000 ? 0 : 15000),
        notes: formData.notes,
      };

      // Crear orden
      const order = await ordersApi.createOrder(orderData);

      // Si es invitado, la orden ya está pagada automáticamente
      if (!user) {
        // Limpiar carrito
        clear();
        // Redirigir a confirmación
        navigate(`/order-confirmation/${order.id}`);
        return;
      }

      // Procesar pago para usuarios registrados según el método seleccionado
      let paidOrder;
      if (paymentMethod === 'balance') {
        paidOrder = await ordersApi.processBalancePayment(order.id);
        // Refrescar el perfil del usuario para actualizar el saldo
        await refreshProfile();
      } else {
        const paymentData: ProcessPaymentData = {
          cardNumber: formData.cardNumber,
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          email: formData.email,
          paymentMethod: 'credit_card',
        };
        paidOrder = await ordersApi.processPayment(order.id, paymentData);
      }

      // Limpiar carrito
      clear();

      // Redirigir a confirmación
      navigate(`/order-confirmation/${paidOrder.id}`);
    } catch (error: any) {
      console.error('Error processing order:', error);
      alert(error.message || 'Error al procesar el pedido. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Finalizar Compra
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete la información para procesar su pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Cliente */}
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center mb-4">
                  <FaShippingFast className={`text-2xl mr-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Información de Envío
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.name 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.phone 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.city 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.address 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Departamento *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.department 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Código Postal (Opcional)
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Notas del Pedido (Opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      placeholder="Instrucciones especiales de entrega, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Información de Pago */}
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center mb-4">
                  <FaCreditCard className={`text-2xl mr-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Información de Pago
                  </h2>
                </div>

                {/* Selector de Método de Pago - Solo para usuarios registrados */}
                {isAuthenticated && user && (
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : isDark
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <FaCreditCard className={`text-2xl mb-2 mx-auto ${
                          paymentMethod === 'card' ? 'text-emerald-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <p className={`text-sm font-medium ${
                          paymentMethod === 'card' ? 'text-emerald-500' : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          Tarjeta de Crédito
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('balance')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === 'balance'
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : isDark
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <FaWallet className={`text-2xl mb-2 mx-auto ${
                          paymentMethod === 'balance' ? 'text-emerald-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <p className={`text-sm font-medium ${
                          paymentMethod === 'balance' ? 'text-emerald-500' : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          Saldo Disponible
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatPrice(user.balance)}
                        </p>
                      </button>
                    </div>
                    {errors.payment && <p className="text-red-500 text-sm mt-2">{errors.payment}</p>}
                  </div>
                )}

                {/* Información para invitados */}
                {!isAuthenticated && (
                  <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      ✓ Como invitado, tu pedido se procesará automáticamente. Recibirás un correo de confirmación.
                    </p>
                  </div>
                )}

                {isAuthenticated && paymentMethod === 'card' && (
                  <>
                    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        <FaLock className="inline mr-2" />
                        Usa la tarjeta de prueba: <strong>4111 1111 1111 1111</strong>
                      </p>
                    </div>

                    <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      value={formatCardNumber(formData.cardNumber)}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.cardNumber 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Titular de la Tarjeta *
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.cardHolder 
                          ? 'border-red-500' 
                          : isDark 
                          ? 'border-gray-700 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Fecha de Vencimiento *
                      </label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.expiryDate 
                            ? 'border-red-500' 
                            : isDark 
                            ? 'border-gray-700 bg-gray-700 text-white' 
                            : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={handleCVVChange}
                        placeholder="123"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.cvv 
                            ? 'border-red-500' 
                            : isDark 
                            ? 'border-gray-700 bg-gray-700 text-white' 
                            : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
                  </>
                )}

                {paymentMethod === 'balance' && (
                  <div className={`p-6 rounded-lg ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50'} border-2 ${
                    user && user.balance >= total ? 'border-emerald-500' : 'border-yellow-500'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Tu Saldo Actual
                        </p>
                        <p className={`text-3xl font-bold ${
                          user && user.balance >= total ? 'text-emerald-500' : 'text-yellow-500'
                        }`}>
                          {user && formatPrice(user.balance)}
                        </p>
                      </div>
                      <FaWallet className="text-4xl text-emerald-500" />
                    </div>
                    
                    <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex justify-between mb-2">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Total a pagar:</span>
                        <span className="font-bold">{formatPrice(total)}</span>
                      </div>
                      {user && user.balance >= total ? (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Saldo restante:</span>
                            <span className="font-bold text-emerald-500">{formatPrice(user.balance - total)}</span>
                          </div>
                          <p className={`text-sm mt-3 flex items-center gap-2 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                            <FaCheckCircle className="flex-shrink-0" />
                            <span>Tienes saldo suficiente para completar esta compra</span>
                          </p>
                        </>
                      ) : (
                        <p className={`text-sm mt-3 flex items-center gap-2 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                          <FaExclamationTriangle className="flex-shrink-0" />
                          <span>Saldo insuficiente. Necesitas agregar {user && formatPrice(total - user.balance)} más</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar Pedido'
                )}
              </button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-24`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-4">
                {(cart?.items || []).map((item, index) => (
                  <div key={item.productId || index} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.quantity} x ${(item.price || item.unitPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4 space-y-2`}>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Envío</span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-semibold">¡Gratis!</span>
                  ) : (
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>${shipping.toLocaleString()}</span>
                  )}
                </div>
                {subtotal < 200000 && (
                  <p className="text-xs text-yellow-600">
                    Agrega ${(200000 - subtotal).toLocaleString()} más para envío gratis
                  </p>
                )}
                <div className={`flex justify-between text-lg font-bold pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                  <span className="text-emerald-600">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                <p className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  <FaLock className="inline mr-1" />
                  Tu información está protegida y segura
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
