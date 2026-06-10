import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ordersApi, getMyOrders } from '../api/orders';
import type { Order } from '../api/orders';
import { FaBox, FaShoppingCart, FaUser, FaHistory, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';

type TabType = 'orders' | 'cart' | 'account';

export default function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const { cart } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userOrders = await getMyOrders();
      const sorted = userOrders.sort((a: Order, b: Order) => {
        const dateA = new Date((a as any).fecha || a.createdAt || '').getTime();
        const dateB = new Date((b as any).fecha || b.createdAt || '').getTime();
        return dateB - dateA;
      });
      setOrders(sorted);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, loadOrders]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: any }> = {
      'pendiente': {
        label: 'Pendiente',
        bgColor: isDark ? 'bg-red-900/20' : 'bg-red-100',
        textColor: isDark ? 'text-red-300' : 'text-red-800',
        icon: FaClock
      },
      'pending': {
        label: 'Pendiente',
        bgColor: isDark ? 'bg-red-900/20' : 'bg-red-100',
        textColor: isDark ? 'text-red-300' : 'text-red-800',
        icon: FaClock
      },
      'pagado': {
        label: 'Pagado',
        bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-100',
        textColor: isDark ? 'text-emerald-300' : 'text-emerald-800',
        icon: FaCheckCircle
      },
      'paid': {
        label: 'Pagado',
        bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-100',
        textColor: isDark ? 'text-emerald-300' : 'text-emerald-800',
        icon: FaCheckCircle
      },
      'procesando': {
        label: 'Procesando',
        bgColor: isDark ? 'bg-teal-900/20' : 'bg-teal-100',
        textColor: isDark ? 'text-teal-300' : 'text-teal-800',
        icon: FaBox
      },
      'processing': {
        label: 'Procesando',
        bgColor: isDark ? 'bg-teal-900/20' : 'bg-teal-100',
        textColor: isDark ? 'text-teal-300' : 'text-teal-800',
        icon: FaBox
      },
      'enviado': {
        label: 'Enviado',
        bgColor: isDark ? 'bg-slate-800' : 'bg-slate-100',
        textColor: isDark ? 'text-slate-300' : 'text-slate-700',
        icon: FaTruck
      },
      'shipped': {
        label: 'Enviado',
        bgColor: isDark ? 'bg-slate-800' : 'bg-slate-100',
        textColor: isDark ? 'text-slate-300' : 'text-slate-700',
        icon: FaTruck
      },
      'entregado': {
        label: 'Entregado',
        bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-100',
        textColor: isDark ? 'text-emerald-300' : 'text-emerald-800',
        icon: FaCheckCircle
      },
      'delivered': {
        label: 'Entregado',
        bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-100',
        textColor: isDark ? 'text-emerald-300' : 'text-emerald-800',
        icon: FaCheckCircle
      },
    };

    const config = statusConfig[status] ?? statusConfig['pendiente'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
        <Icon className="text-sm" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center py-12`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Debes iniciar sesión
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Por favor inicia sesión para ver tu perfil
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Mi Perfil
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Bienvenido de nuevo, {user.name}
          </p>
        </div>

        {/* Tabs */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md mb-6`}>
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaHistory />
              Mis Pedidos
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'cart'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaShoppingCart />
              Mi Carrito
              {cart && cart.items.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                  {cart.items.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'account'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUser />
              Cuenta
            </button>
          </div>

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Historial de Pedidos
                </h2>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaBox className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      No tienes pedidos aún
                    </p>
                    <Link
                      to="/products"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700"
                    >
                      Explorar productos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const rawOrder = order as any;
                      const orderId = String(rawOrder.id_pedido ?? rawOrder.id ?? '');
                      const estado = rawOrder.estado ?? rawOrder.status ?? 'pendiente';
                      const fecha = rawOrder.fecha ?? rawOrder.createdAt;
                      const total = Number(rawOrder.total ?? 0);
                      const items = rawOrder.items ?? rawOrder.detalles ?? [];
                      const shipping = rawOrder.shippingInfo ?? rawOrder.customer;

                      return (
                      <div
                        key={orderId}
                        className={`${
                          isDark ? 'bg-gray-700' : 'bg-gray-50'
                        } rounded-lg p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Pedido #{orderId}
                              </h3>
                              {getStatusBadge(estado)}
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Fecha: {formatDate(fecha)}
                            </p>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className={`text-2xl font-bold text-emerald-600`}>
                              ${total.toLocaleString()}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {items.length} {items.length === 1 ? 'producto' : 'productos'}
                            </p>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-3 mb-4">
                          {items.map((item: any, index: number) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 p-3 rounded ${
                                isDark ? 'bg-gray-800' : 'bg-white'
                              }`}
                            >
                              <div className={`w-16 h-16 rounded flex items-center justify-center ${
                                isDark ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                ) : (
                                  <FaBox className={`text-2xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {item.name ?? `Producto ${item.id_producto ?? item.productId}`}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Cantidad: {item.cantidad ?? item.quantity} | ${Number(item.precio_unit ?? item.unitPrice ?? 0).toLocaleString()} c/u
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        {shipping && (
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} mb-4`}>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                            Dirección de envío:
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {shipping.address}, {shipping.city}
                          </p>
                        </div>
                        )}

                        <Link
                          to={`/order-confirmation/${orderId}`}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors text-sm font-semibold"
                        >
                          Ver detalles
                        </Link>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Mi Carrito Actual
                </h2>

                {!cart || cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingCart className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      Tu carrito está vacío
                    </p>
                    <Link
                      to="/products"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700"
                    >
                      Explorar productos
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-4 p-4 rounded-lg ${
                            isDark ? 'bg-gray-700' : 'bg-gray-50'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {item.name}
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              ${(item.price || item.unitPrice || 0).toLocaleString()} x {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              ${((item.price || item.unitPrice || 0) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}>
                      <div className="flex justify-between mb-2">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                          ${cart.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                        <span className="text-emerald-600">${cart.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        to="/cart"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors text-center font-semibold"
                      >
                        Ver carrito completo
                      </Link>
                      <Link
                        to="/checkout"
                        className={`flex-1 px-6 py-3 ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        } rounded-lg transition-colors text-center font-semibold`}
                      >
                        Proceder al pago
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Información de la Cuenta
                </h2>

                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 space-y-4`}>
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nombre
                    </label>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email
                    </label>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.email}
                    </p>
                  </div>
                  {user.phone && (
                    <div>
                      <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Teléfono
                      </label>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.phone}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tipo de cliente
                    </label>
                    <p className={`text-lg capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.tipo ?? 'Persona'}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Para actualizar tu información de cuenta, contáctanos a través del formulario de contacto.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}