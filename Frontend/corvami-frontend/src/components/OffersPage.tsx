import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  discount: number;
  inStock: boolean;
}

const OffersPage: React.FC = () => {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const { isAuthenticated, isGuest, setShowAuthModal } = useAuth();
  // const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // loadProducts();
    setLoading(false);
  }, []);

  // const loadProducts = async () => {
  //   try {
  //     const data = await productApi.getAll();
  //     setProducts(data);
  //   } catch (error) {
  //     console.error('Error cargando productos:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Crear productos con descuentos aleatorios
  const productsWithOffers: Product[] = []; // products.slice(0, 24).map(p => {
  //   const discounts = [10, 15, 20, 25, 30, 35, 40];
  //   const discount = discounts[Math.floor(Math.random() * discounts.length)];
  //   const originalPrice = p.price;
  //   const price = Math.round(originalPrice * (1 - discount / 100));

  //   return {
  //     id: p.productId,
  //     name: p.name,
  //     price,
  //     originalPrice,
  //     image: p.imageUrl || 'https://via.placeholder.com/400',
  //     rating: 4 + Math.random(),
  //     reviews: Math.floor(Math.random() * 100) + 10,
  //     brand: p.brand || 'Sin marca',
  //     discount,
  //     inStock: p.stock > 0,
  //   };
  // });

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated && !isGuest) {
      setShowAuthModal(true);
      return;
    }

    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }, 1);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070b]">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070b]">
      {/* Header */}
      <div className="py-12 bg-gradient-to-r from-red-900/20 to-emerald-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
              OFERTAS
            </div>
            <div className="px-4 py-2 rounded-lg font-semibold bg-gray-800 text-emerald-400">
              Hasta 40% OFF
            </div>
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ¡Las Mejores Ofertas del Mes!
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Aprovecha estos descuentos increíbles en productos seleccionados. ¡Stock limitado!
          </p>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className={`py-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Todas las ofertas
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
            }`}>
              Más de 30% OFF
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
            }`}>
              Gaming
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
            }`}>
              Periféricos
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Productos en Oferta */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsWithOffers.map((product) => (
            <div
              key={product.id}
              className={`group rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800 hover:border-green-500/50'
                  : 'bg-white border border-gray-200 hover:border-green-300'
              } shadow-lg hover:shadow-2xl relative`}
            >
              {/* Badge de Descuento */}
              <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                -{product.discount}%
              </div>

              {/* Imagen */}
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>

              {/* Información */}
              <div className="p-4">
                {/* Marca */}
                <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {product.brand}
                </p>

                {/* Nombre */}
                <Link to={`/product/${product.id}`}>
                  <h3 className={`font-semibold mb-3 line-clamp-2 hover:text-green-500 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar
                        key={i}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}
                        size={14}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                    ({product.reviews})
                  </span>
                </div>

                {/* Precios */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      Ahorras {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                </div>

                {/* Botón Agregar */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    product.inStock
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <AiOutlineShoppingCart size={20} />
                  {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sin ofertas */}
        {productsWithOffers.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No hay ofertas disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
