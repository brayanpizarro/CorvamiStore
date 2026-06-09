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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden transition-all duration-300 bg-background">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse bg-primary/8"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 bg-accent/25"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Productos</span> Destacados
          </h2>
          <p className="text-xl text-muted-foreground">Los más vendidos con ofertas especiales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.productId} className="backdrop-blur-sm rounded-xl border-2 shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105 bg-card/80 border-border hover:border-primary/40 hover:bg-card/95 hover:shadow-primary/10">
              <div className="relative overflow-hidden aspect-video sm:aspect-square">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    Stock: {product.stock}
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors text-foreground">{product.name}</h3>
                <p className="text-xs sm:text-sm mb-3 line-clamp-2 text-muted-foreground">{product.description}</p>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={cartLoading || product.stock === 0}
                  className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    cartLoading || product.stock === 0
                      ? 'bg-muted cursor-not-allowed text-muted-foreground'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30'
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