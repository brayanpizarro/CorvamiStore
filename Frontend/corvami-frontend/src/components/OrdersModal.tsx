import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getMyOrders } from '../api/orders';
import type { Order } from '../api/orders';
import { X } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'completado':
        return 'text-green-500 bg-green-500/10';
      case 'pending':
      case 'pendiente':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'cancelled':
      case 'cancelado':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/50'
    } backdrop-blur-sm overflow-y-auto`}>
      <div className={`max-w-4xl w-full rounded-2xl p-6 my-8 ${
        theme === 'dark' ? 'bg-gray-900 border-2 border-green-500/50' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Mis Órdenes
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Historial de compras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Cargando órdenes...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-4 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600"
            >
              Reintentar
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No tienes órdenes todavía
            </p>
          </div>
        ) : selectedOrder ? (
          // Vista detallada de orden
          <div className="space-y-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              ← Volver a todas las órdenes
            </button>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Orden #{selectedOrder.orderId.slice(-8)}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Productos:
                </h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-green-500">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Información de envío:
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Nombre:</strong> {selectedOrder.shippingInfo.name}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Dirección:</strong> {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Teléfono:</strong> {selectedOrder.shippingInfo.phone}
                </p>
              </div>

              {/* Total */}
              <div className={`pt-4 border-t mt-4 flex justify-between text-xl font-bold ${
                theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
              }`}>
                <span>Total:</span>
                <span className="text-green-500">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          // Lista de órdenes
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.orderId}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Orden #{order.orderId.slice(-8)}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-lg font-bold text-green-500">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersModal;
