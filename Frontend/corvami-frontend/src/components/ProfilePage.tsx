import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ordersApi } from '../api/orders';
import type { Order } from '../api/orders';
import ReviewModal from './ReviewModal';
import { FaBox, FaShoppingCart, FaUser, FaHistory, FaCheckCircle, FaClock, FaTruck, FaStar } from 'react-icons/fa';

type TabType = 'orders' | 'cart' | 'account';

export default function ProfilePage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{ productId: string; productName: string } | null>(null);

  useEffect(() => {
    if (user?.email) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const userOrders = await ordersApi.getOrdersByEmail(user.email);
      // Ordenar por fecha descendente (más reciente primero)
      const sorted = userOrders.sort((a, b) => 
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: any }> = {
      'pending': {
        label: 'Pendiente',
        bgColor: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100',
        textColor: isDark ? 'text-yellow-400' : 'text-yellow-800',
        icon: FaClock
      },
      'paid': {
        label: 'Pagado',
        bgColor: isDark ? 'bg-green-900/30' : 'bg-green-100',
        textColor: isDark ? 'text-green-400' : 'text-green-800',
        icon: FaCheckCircle
      },
      'processing': {
        label: 'Procesando',
        bgColor: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
        textColor: isDark ? 'text-blue-400' : 'text-blue-800',
        icon: FaBox
      },
      'shipped': {
        label: 'Enviado',
        bgColor: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
        textColor: isDark ? 'text-purple-400' : 'text-purple-800',
        icon: FaTruck
      },
      'delivered': {
        label: 'Entregado',
        bgColor: isDark ? 'bg-emerald-900/30' : 'bg-emerald-100',
        textColor: isDark ? 'text-emerald-400' : 'text-emerald-800',
        icon: FaCheckCircle
      }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
        <Icon className="text-sm" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
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
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className={`${
                          isDark ? 'bg-gray-700' : 'bg-gray-50'
                        } rounded-lg p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Pedido #{order.id.substring(0, 8).toUpperCase()}
                              </h3>
                              {getStatusBadge(order.status || 'pending')}
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Fecha: {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className={`text-2xl font-bold text-emerald-600`}>
                              ${order.total.toLocaleString()}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                            </p>
                          </div>
                        </div>

                        {/* Order Items Preview with Review Buttons */}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 p-3 rounded ${
                                isDark ? 'bg-gray-800' : 'bg-white'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {item.name}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Cantidad: {item.quantity} | ${(item.unitPrice || 0).toLocaleString()} c/u
                                </p>
                              </div>
                              {order.isPaid && (
                                <button
                                  onClick={() => setReviewModal({ 
                                    productId: item.productId, 
                                    productName: item.name 
                                  })}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                                    isDark
                                      ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  } transition-colors`}
                                >
                                  <FaStar className="text-yellow-400" />
                                  Reseñar
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} mb-4`}>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                            Dirección de envío:
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {order.customer.address}, {order.customer.city}
                          </p>
                        </div>

                        <Link
                          to={`/order-confirmation/${order.id}`}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors text-sm font-semibold"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    ))}
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

      {/* Review Modal */}
      {reviewModal && user && (
        <ReviewModal
          productId={reviewModal.productId}
          productName={reviewModal.productName}
          userId={user.id}
          onClose={() => setReviewModal(null)}
          onSuccess={() => {
            // Opcional: recargar órdenes si quieres actualizar algo
          }}
        />
      )}
    </div>
  );
}
