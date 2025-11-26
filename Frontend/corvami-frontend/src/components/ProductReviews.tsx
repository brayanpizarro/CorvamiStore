import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { reviewsApi, Review, ReviewsSummary } from '../api/reviews';
import { FaStar, FaRegStar, FaEdit, FaTrash } from 'react-icons/fa';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<'new' | 'top'>('new');
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  });

  useEffect(() => {
    loadReviews();
    loadSummary();
  }, [productId, page, sort]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsApi.getReviews(productId, page, 10, sort);
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const data = await reviewsApi.getReviewsSummary(productId);
      setSummary(data);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    try {
      await reviewsApi.createReview(productId, {
        userId: user.id,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
      });

      setFormData({ rating: 5, title: '', content: '' });
      setShowReviewForm(false);
      loadReviews();
      loadSummary();
      alert('¡Reseña publicada exitosamente!');
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Error al publicar la reseña');
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            {star <= rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className={isDark ? 'text-gray-600' : 'text-gray-300'} />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mt-8`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Reseñas de Clientes
      </h2>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-1">
                {renderStars(Math.round(summary.averageRating))}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {summary.totalReviews} {summary.totalReviews === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution];
                const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2 mb-2">
                    <span className={`text-sm w-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {rating} <FaStar className="inline text-yellow-400 text-xs" />
                    </span>
                    <div className={`flex-1 h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-sm w-12 text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors font-semibold"
            >
              {showReviewForm ? 'Cancelar' : 'Escribir una reseña'}
            </button>
          )}
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className={`mb-8 p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Escribe tu reseña
          </h3>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Calificación
            </label>
            {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Título (opcional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={140}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500`}
              placeholder="Resumen de tu experiencia"
            />
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Reseña
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500`}
              placeholder="Cuéntanos sobre tu experiencia con este producto..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors font-semibold"
          >
            Publicar reseña
          </button>
        </form>
      )}

      {/* Sort Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSort('new')}
          className={`px-4 py-2 rounded-lg font-medium ${
            sort === 'new'
              ? 'bg-emerald-600 text-white'
              : isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Más recientes
        </button>
        <button
          onClick={() => setSort('top')}
          className={`px-4 py-2 rounded-lg font-medium ${
            sort === 'top'
              ? 'bg-emerald-600 text-white'
              : isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Mejor valoradas
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No hay reseñas aún. ¡Sé el primero en dejar una!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.commentId}
              className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {review.title}
                    </h4>
                  )}
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            Anterior
          </button>
          <span className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
