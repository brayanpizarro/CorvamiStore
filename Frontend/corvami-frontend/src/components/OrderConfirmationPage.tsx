import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ordersApi } from '../api/orders';
import type { Order } from '../api/orders';
import { FaCheckCircle, FaBox, FaTruck, FaEnvelope } from 'react-icons/fa';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderData = await ordersApi.getOrder(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Orden no encontrada
          </h2>
          <Link
            to="/products"
            className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            ¡Pedido Confirmado!
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Tu pedido ha sido procesado exitosamente
          </p>
        </div>

        {/* Order Details Card */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Número de Orden
              </h3>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                #{order.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Estado del Pago
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.isPaid 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {order.isPaid ? 'Pagado' : 'Pendiente'}
              </span>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <div className="flex items-start">
              <FaEnvelope className={`text-xl mr-3 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <p className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                  Correo de Confirmación Enviado
                </p>
                <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Hemos enviado los detalles de tu pedido a <strong>{order.customer.email}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FaTruck className={`text-xl mr-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Dirección de Envío
              </h3>
            </div>
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {order.customer.name}
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {order.customer.address}
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {order.customer.city}, {order.customer.department}
              </p>
              {order.customer.zipCode && (
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  C.P. {order.customer.zipCode}
                </p>
              )}
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Tel: {order.customer.phone}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FaBox className={`text-xl mr-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Productos
              </h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${item.totalPrice.toLocaleString()}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${item.unitPrice.toLocaleString()} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  ${order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Envío</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  ${order.shipping.toLocaleString()}
                </span>
              </div>
              <div className={`flex justify-between text-lg font-bold pt-2 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                <span className="text-emerald-600">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {order.payment?.transactionId && (
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ID de Transacción: <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {order.payment.transactionId}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-colors text-center"
          >
            Seguir Comprando
          </Link>
          <Link
            to="/profile"
            className={`px-6 py-3 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            } rounded-lg font-semibold transition-colors text-center`}
          >
            Ver Mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
