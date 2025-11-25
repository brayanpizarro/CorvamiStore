import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productApi, type Product as ApiProduct } from '../api/products';

interface ProductsSectionProps {
  onAddToCart?: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ onAddToCart }) => {
  const { theme } = useTheme();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated, isGuest, setShowAuthModal } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data.slice(0, 4)); // Mostrar solo los primeros 4
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: ApiProduct) => {
    // Verificar si el usuario está autenticado o es invitado
    if (!isAuthenticated && !isGuest) {
      setShowAuthModal(true);
      return;
    }

    try {
      await addItem({
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
      }, 1);
      if (onAddToCart) onAddToCart();
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <section className={`py-16 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/30'
        }`}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 ${
          theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-500/25'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Productos</span> Destacados
          </h2>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Los más vendidos con ofertas especiales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.productId} className={`backdrop-blur-sm rounded-xl border-2 shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/60 hover:bg-gray-700/70 hover:shadow-green-500/25'
                : 'bg-white/80 border-green-400/40 hover:border-green-500/70 hover:bg-white/90 hover:shadow-green-400/30'
            }`}>
              <div className="relative overflow-hidden">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Stock: {product.stock}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-green-400">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar key={i} size={16} className={i < 4 ? "" : "opacity-30"} />
                    ))}
                  </div>
                  <span className={`text-sm ml-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>(4.5)</span>
                </div>
                <h3 className={`font-bold mb-2 group-hover:text-green-300 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{product.name}</h3>
                <p className={`text-sm mb-3 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-400">{formatPrice(product.price)}</span>
                </div>
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={cartLoading || product.stock === 0}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    cartLoading || product.stock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black hover:shadow-green-500/50'
                  }`}
                >
                  {product.stock === 0 ? 'Agotado' : cartLoading ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;