import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { AiFillStar, AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlinePlus, AiOutlineMinus, AiOutlineCheck } from 'react-icons/ai';
import { MdOutlineLocalShipping, MdOutlineShield, MdOutlineLoop } from 'react-icons/md';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { RiAwardLine } from 'react-icons/ri';
import ReviewModal from './ReviewModal';
import { canReviewProduct, getProductComments, type Comment } from '../api/comments';

interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  subcategory: string;
  features: string[];
  inStock: boolean;
  discount?: number;
  description?: string;
  specifications?: Record<string, string>;
  warranty?: string;
  stockQuantity?: number;
}

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
  onAddToCart?: (quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const { theme } = useTheme();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated, isGuest, setShowAuthModal, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const images = product.images || [product.image];

  // Cargar comentarios
  useEffect(() => {
    loadComments();
  }, [product.id]);

  // Verificar si puede dejar reseña
  useEffect(() => {
    if (isAuthenticated && user) {
      checkCanReview();
    }
  }, [isAuthenticated, user, product.id]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getProductComments(String(product.id));
      setComments(data);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const can = await canReviewProduct(String(product.id));
      setCanReview(can);
    } catch (error) {
      console.error('Error verificando permiso de reseña:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    // Verificar si el usuario está autenticado o es invitado
    if (!isAuthenticated && !isGuest) {
      setShowAuthModal(true);
      return;
    }

    try {
      await addItem({
        productId: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      }, quantity);
    } catch (e) {
      console.error('Error agregando al carrito', e);
    }
    if (onAddToCart) onAddToCart(quantity);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className={`py-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {onBack && (
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:gap-3 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
            >
              <span>←</span>
              Volver
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className={`relative rounded-2xl overflow-hidden mb-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} p-8`}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                  -{product.discount}%
                </div>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white'
                      : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                } shadow-lg`}
              >
                {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'
                    } shadow-lg transition-all`}
                  >
                    <IoChevronBack size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'
                    } shadow-lg transition-all`}
                  >
                    <IoChevronForward size={20} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-green-500 shadow-lg scale-105'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    } ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-2`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="mb-4">
              <p className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {product.brand}
              </p>
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {product.name}
              </h1>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.rating}
                </span>
              </div>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                ({product.reviews} reseñas)
              </span>
            </div>
            <div className="mb-6">
              <div className={`text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-3">
                  <span className={`text-xl line-through ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    Ahorra {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 ${
              product.inStock
                ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                : theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700'
            }`}>
              <AiOutlineCheck size={16} />
              <span className="font-semibold">
                {product.inStock ? 'En Stock' : 'Agotado'}
              </span>
            </div>
            <div className={`rounded-xl p-4 mb-6 ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Características Principales
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className={`flex items-start gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <AiOutlineCheck size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            {product.inStock && (
              <div className="mb-6">
                <label className={`block text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center border rounded-lg ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  }`}>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className={`p-3 ${
                        quantity <= 1
                          ? 'opacity-50 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'hover:bg-gray-800'
                            : 'hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <AiOutlineMinus size={18} />
                    </button>
                    <span className={`px-6 font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stockQuantity || 10)}
                      className={`p-3 ${
                        quantity >= (product.stockQuantity || 10)
                          ? 'opacity-50 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'hover:bg-gray-800'
                            : 'hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <AiOutlinePlus size={18} />
                    </button>
                  </div>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.stockQuantity || 10} disponibles
                  </span>
                </div>
              </div>
            )}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || cartLoading}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                  product.inStock && !cartLoading
                    ? theme === 'dark'
                      ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg hover:shadow-green-500/50'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-600/50'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <AiOutlineShoppingCart size={24} />
                {cartLoading ? 'Agregando...' : 'Agregar al Carrito'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <MdOutlineLocalShipping className="text-green-500" size={20} />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Envío Gratis
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    En compras +$100k
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <MdOutlineShield className="text-blue-500" size={20} />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Garantía
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.warranty || '1 año'}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <MdOutlineLoop className="text-purple-500" size={20} />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Devolución
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    30 días
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <RiAwardLine className="text-yellow-500" size={20} />
                <div>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Producto Original
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Certificado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className={`flex border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'description'
                  ? theme === 'dark'
                    ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500'
                    : 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descripción
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'specs'
                  ? theme === 'dark'
                    ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500'
                    : 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Especificaciones
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? theme === 'dark'
                    ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500'
                    : 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reseñas ({product.reviews})
            </button>
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                <p className="text-lg leading-relaxed">
                  {product.description || `${product.name} es un producto de alta calidad de ${product.brand}. 
                  Diseñado para ofrecer el mejor rendimiento y durabilidad. Ideal para usuarios que buscan 
                  tecnología de punta con las mejores características del mercado.`}
                </p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className={`flex justify-between p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {key}:
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No hay especificaciones disponibles
                  </div>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Botón para dejar reseña */}
                {isAuthenticated && canReview && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full py-3 px-4 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Escribir Reseña
                    </button>
                  </div>
                )}

                {/* Mensaje si no puede dejar reseña */}
                {isAuthenticated && !canReview && (
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Solo los usuarios que han comprado este producto pueden dejar reseñas
                    </p>
                  </div>
                )}

                {/* Lista de comentarios */}
                {loadingComments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className={`text-center py-8 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <p>Aún no hay reseñas para este producto</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.commentId}
                        className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                      >
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${
                                  star <= comment.rating
                                    ? 'text-yellow-400'
                                    : theme === 'dark'
                                    ? 'text-gray-600'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {new Date(comment.createdAt).toLocaleDateString('es-CO')}
                          </span>
                        </div>

                        {/* Title */}
                        {comment.title && (
                          <h4 className={`font-semibold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {comment.title}
                          </h4>
                        )}

                        {/* Content */}
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={String(product.id)}
        productName={product.name}
        onReviewSubmitted={loadComments}
      />
    </div>
  );
};

export default ProductDetail;
