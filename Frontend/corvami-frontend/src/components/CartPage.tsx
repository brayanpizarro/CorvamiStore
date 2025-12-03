import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus, AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';
import { MdArrowBack } from 'react-icons/md';
import { productApi, type Product as ApiProduct } from '../api/products';

const CartPage: React.FC = () => {
  const { theme } = useTheme();
  const { cart, updateItem, removeItem, loading } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState<ApiProduct[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const items = cart?.items || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const loadRecommendations = async () => {
      const cartItems = cart?.items || [];
      try {
        const products = await productApi.getAll();
        const cartProductIds = cartItems.map(item => item.productId);
      
        // Obtener categorías de productos en el carrito
        const cartCategories = new Set<string>();
        cartItems.forEach(item => {
          const product = products.find(p => p.productId === item.productId);
          if (product?.category) {
            cartCategories.add(product.category);
          }
        });

        // Definir productos complementarios por categoría
        const complementaryMap: Record<string, string[]> = {
          'laptops': ['teclados', 'mouse', 'monitores', 'audifonos'],
          'teclados': ['mouse', 'audifonos', 'webcams'],
          'mouse': ['teclados', 'audifonos', 'webcams'],
          'monitores': ['laptops', 'webcams', 'audifonos'],
          'audifonos': ['laptops', 'teclados', 'mouse'],
          'webcams': ['monitores', 'audifonos', 'laptops'],
        };

        // Filtrar productos que no están en el carrito
        const filtered = products.filter(p => !cartProductIds.includes(p.productId));

        // Priorizar productos complementarios y de mismas categorías
        const recommendations: ApiProduct[] = [];
        const complementaryProducts: ApiProduct[] = [];
        const sameCategoryProducts: ApiProduct[] = [];
        const otherProducts: ApiProduct[] = [];

        filtered.forEach(product => {
          const isComplementary = Array.from(cartCategories).some(category => 
            complementaryMap[category]?.includes(product.category || '')
          );
          const isSameCategory = cartCategories.has(product.category || '');

          if (isComplementary) {
            complementaryProducts.push(product);
          } else if (isSameCategory) {
            sameCategoryProducts.push(product);
          } else {
            otherProducts.push(product);
          }
        });

        // Mezclar y tomar 4 productos (prioridad: complementarios > misma categoría > otros)
        const shuffleArray = (array: ApiProduct[]) => array.sort(() => 0.5 - Math.random());
        
        recommendations.push(...shuffleArray(complementaryProducts).slice(0, 2));
        if (recommendations.length < 4) {
          recommendations.push(...shuffleArray(sameCategoryProducts).slice(0, 4 - recommendations.length));
        }
        if (recommendations.length < 4) {
          recommendations.push(...shuffleArray(otherProducts).slice(0, 4 - recommendations.length));
        }

        setRecommendedProducts(recommendations.slice(0, 4));
      } catch (error) {
        console.error('Error cargando recomendaciones:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [cart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen py-20 transition-all duration-300 ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className={`text-6xl mb-6 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              <AiOutlineShoppingCart className="mx-auto" size={96} />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Tu carrito está vacío
            </h2>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              ¡Agrega productos para comenzar tu compra!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 mb-4 ${
              theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
            } transition-colors`}
          >
            <MdArrowBack size={20} />
            <span>Seguir comprando</span>
          </Link>
          <h1 className={`text-4xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Carrito de Compras
          </h1>
          <p className={`text-lg mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className={`rounded-xl border-2 p-6 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/60'
                    : 'bg-white border-gray-200 hover:border-green-400/60'
                }`}
              >
                <div className="flex gap-6">
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.name}
                    </h3>
                    <p className={`text-2xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatPrice(item.unitPrice || item.price || 0)}
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                          disabled={loading}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          } disabled:opacity-50`}
                        >
                          <AiOutlineMinus size={16} />
                        </button>
                        <span className={`w-12 text-center font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.productId, item.quantity + 1)}
                          disabled={loading}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          } disabled:opacity-50`}
                        >
                          <AiOutlinePlus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        disabled={loading}
                        className={`ml-auto p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-red-900/50 hover:bg-red-800/70 text-red-400'
                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                        } disabled:opacity-50`}
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>

                    {/* Subtotal por producto */}
                    <div className={`mt-3 text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Subtotal: {formatPrice((item.unitPrice || item.price || 0) * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl border-2 p-6 sticky top-24 ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-green-500/30'
                : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className={`flex justify-between ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className={`flex justify-between ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-500">GRATIS</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 200000 && (
                  <div className={`text-sm p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    ¡Agrega {formatPrice(200000 - subtotal)} más para envío gratis!
                  </div>
                )}
                <div className={`pt-4 border-t-2 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className={`flex justify-between text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span>Total</span>
                    <span className="text-green-500">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105 shadow-lg mb-4 text-center"
              >
                Proceder al Pago
              </Link>

              <Link
                to="/products"
                className={`block w-full py-3 text-center rounded-lg border-2 font-semibold transition-all ${
                  theme === 'dark'
                    ? 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                    : 'border-green-500 text-green-600 hover:bg-green-50'
                }`}
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Productos Recomendados */}
        {!loadingRecommendations && recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-3xl font-bold mb-8 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.productId}
                  to={`/products`}
                  className={`rounded-xl border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/60'
                      : 'bg-white border-gray-200 hover:border-green-400/60'
                  }`}
                >
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className={`font-bold mb-2 line-clamp-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className={i < 4 ? 'text-yellow-400' : 'text-gray-400'}
                          size={14}
                        />
                      ))}
                    </div>
                    <p className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
