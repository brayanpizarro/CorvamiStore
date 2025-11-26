import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { User, CreditCard, Truck, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, onSuccess }) => {
  const { theme } = useTheme();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  // Calcular total del carrito
  const cartTotal = cart?.items.reduce((sum, item) => {
    const price = item.unitPrice || item.price || 0;
    return sum + (price * item.quantity);
  }, 0) || 0;

  // Formulario de datos - prellenar si el usuario está autenticado
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Colombia',
    balance: cartTotal,
  });

  // Actualizar datos si el usuario inicia sesión o cambia
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'Colombia',
        balance: cartTotal,
      });
    }
  }, [user, isAuthenticated, cartTotal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Si el usuario está registrado, usar su userId
      const userId = isAuthenticated && user ? user.userId : undefined;

      const orderData = {
        userId, // Solo se incluye si es usuario registrado
        items: cart?.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.unitPrice || item.price,
          quantity: item.quantity,
          imageUrl: item.image,
        })) || [],
        total: cartTotal,
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
        },
        paymentMethod: 'balance',
        isGuestCheckout: !isAuthenticated,
      };

      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al procesar la orden');
      }

      const order = await response.json();
      clearCart();
      setStep('success');
      setTimeout(() => {
        onSuccess(order.orderId);
      }, 2000);
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (step === 'success') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/50'
      } backdrop-blur-sm`}>
        <div className={`max-w-md w-full rounded-2xl p-8 text-center ${
          theme === 'dark' ? 'bg-gray-900 border-2 border-green-500' : 'bg-white'
        } shadow-2xl`}>
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            ¡Compra Exitosa!
          </h2>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Tu pedido ha sido procesado correctamente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/50'
    } backdrop-blur-sm overflow-y-auto`}>
      <div className={`max-w-2xl w-full rounded-2xl p-6 md:p-8 my-8 ${
        theme === 'dark' ? 'bg-gray-900 border-2 border-green-500/50' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {step === 'info' ? 'Información de Envío' : 'Confirmar Pago'}
          </h2>
          <button
            onClick={onClose}
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === 'info' ? 'bg-green-500 text-black' : 'bg-green-500/20 text-green-500'
            } font-bold`}>
              1
            </div>
            <span className={`ml-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Información
            </span>
          </div>
          <div className={`w-12 h-0.5 ${
            step === 'payment' ? 'bg-green-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === 'payment' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-400'
            } font-bold`}>
              2
            </div>
            <span className={`ml-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Pago
            </span>
          </div>
        </div>

        {/* Formulario de Información */}
        {step === 'info' && (
          <form onSubmit={handleSubmitInfo} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <User size={16} className="inline mr-2" />
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none transition-colors`}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none transition-colors`}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none transition-colors`}
                  placeholder="3001234567"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Truck size={16} className="inline mr-2" />
                Dirección de Envío *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none transition-colors`}
                placeholder="Calle 123 #45-67"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none transition-colors`}
                  placeholder="Bogotá"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  País *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none transition-colors`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg hover:shadow-green-500/50"
            >
              Continuar al Pago →
            </button>
          </form>
        )}

        {/* Formulario de Pago */}
        {step === 'payment' && (
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            <div className={`p-6 rounded-lg border-2 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Resumen del Pedido
              </h3>
              <div className="space-y-2">
                {cart?.items.map((item) => {
                  const price = item.unitPrice || item.price || 0;
                  return (
                    <div key={item.productId} className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-green-500">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
                <div className={`pt-4 border-t-2 flex justify-between text-xl font-bold ${
                  theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
                }`}>
                  <span>Total:</span>
                  <span className="text-green-500">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg border-2 ${
              theme === 'dark' ? 'bg-gray-800 border-green-500/30' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-green-500" size={24} />
                <h3 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Método de Pago
                </h3>
              </div>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {isAuthenticated 
                  ? 'Se deducirá de tu saldo registrado'
                  : 'Como invitado, se cargará el monto exacto de tu compra'}
              </p>
              {isAuthenticated && user && (
                <div className={`mb-3 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Saldo disponible
                  </p>
                  <p className={`text-lg font-bold ${
                    user.balance >= cartTotal 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                  </p>
                  {user.balance < cartTotal && (
                    <p className="text-xs text-red-500 mt-1">
                      Saldo insuficiente. Agrega más saldo para continuar.
                    </p>
                  )}
                </div>
              )}
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                Saldo a cargar: {formatPrice(cartTotal)}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('info')}
                className={`flex-1 py-4 rounded-lg font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-4 rounded-lg font-bold transition-all shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 hover:shadow-green-500/50'
                } text-black`}
              >
                {loading ? 'Procesando...' : `Pagar ${formatPrice(cartTotal)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
