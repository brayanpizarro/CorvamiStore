import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { cart, updateItem, removeItem, clear, loading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const total = cart?.items?.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0) || 0;
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleQuantityChange = async (productId: string, delta: number) => {
    const item = cart?.items?.find((i) => i.productId === productId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      await updateItem(productId, newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Mi Carrito
              {itemCount > 0 && (
                <span className={`ml-2 text-sm font-normal ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={64} className={`mb-4 ${
                theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
              }`} />
              <p className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tu carrito está vacío
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Agrega productos para empezar a comprar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm mb-1 truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.name}
                    </h3>
                    <p className={`text-lg font-bold mb-2 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatPrice(item.unitPrice || 0)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center border rounded-lg ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                      }`}>
                        <button
                          onClick={() => handleQuantityChange(item.productId, -1)}
                          disabled={loading || item.quantity <= 1}
                          className={`p-1.5 ${
                            loading || item.quantity <= 1
                              ? 'opacity-50 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-200'
                          } transition-colors`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={`px-3 text-sm font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, 1)}
                          disabled={loading}
                          className={`p-1.5 ${
                            loading
                              ? 'opacity-50 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-200'
                          } transition-colors`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        disabled={loading}
                        className={`p-1.5 rounded-lg transition-colors ${
                          loading
                            ? 'opacity-50 cursor-not-allowed'
                            : theme === 'dark'
                              ? 'hover:bg-red-500/20 text-red-400'
                              : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Total:
              </span>
              <span className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatPrice(total)}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                  loading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                }`}
              >
                Proceder al Pago
              </button>
              <button
                onClick={() => clear()}
                disabled={loading}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
