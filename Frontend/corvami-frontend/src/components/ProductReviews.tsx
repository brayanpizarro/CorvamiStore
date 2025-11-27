import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { reviewsApi } from '../api/reviews';
import type { Review, ReviewsSummary } from '../api/reviews';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaReply, FaEdit, FaTrash, FaImage, FaTimes } from 'react-icons/fa';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<'new' | 'top'>('new');
  const [replies, setReplies] = useState<Record<string, Review[]>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
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
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
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
      setSummary(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 6) {
      alert('Máximo 6 imágenes por reseña');
      return;
    }

    setImageFiles([...imageFiles, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title || '',
      content: review.content,
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (commentId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      await reviewsApi.deleteReview(productId, commentId);
      loadReviews();
      loadSummary();
      alert('Reseña eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error al eliminar la reseña');
    }
  };

  const handleToggleHelpful = async (commentId: string, isHelpful: boolean) => {
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      if (isHelpful) {
        await reviewsApi.markHelpful(productId, commentId);
      } else {
        await reviewsApi.markUnhelpful(productId, commentId);
      }
      loadReviews();
    } catch (error) {
      console.error('Error toggling helpful:', error);
    }
  };

  const loadReplies = async (commentId: string) => {
    try {
      const data = await reviewsApi.getReplies(productId, commentId);
      setReplies(prev => ({ ...prev, [commentId]: data }));
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleReply = async (parentCommentId: string, content: string) => {
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      await reviewsApi.createReview(productId, {
        userId: user.userId,
        rating: 0,
        content,
        parentCommentId,
      });
      setReplyingTo(null);
      loadReplies(parentCommentId);
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Error al enviar respuesta');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    try {
      // TODO: Upload images to Cloudinary if imageFiles exist
      const mediaUrls: string[] = []; // For now, empty

      if (editingReview) {
        await reviewsApi.updateReview(productId, editingReview.commentId, {
          rating: formData.rating,
          title: formData.title,
          content: formData.content,
          mediaUrls,
        });
        alert('Reseña actualizada exitosamente');
      } else {
        await reviewsApi.createReview(productId, {
          userId: user.userId,
          rating: formData.rating,
          title: formData.title,
          content: formData.content,
          mediaUrls,
        });
        alert('¡Reseña publicada exitosamente!');
      }

      setFormData({ rating: 5, title: '', content: '' });
      setImageFiles([]);
      setImagePreviews([]);
      setShowReviewForm(false);
      setEditingReview(null);
      loadReviews();
      loadSummary();
    } catch (error) {
      console.error('Error creating/updating review:', error);
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
      {summary && summary.averageRating !== undefined && (
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

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Imágenes (opcional, máx. 6)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer ${
                isDark
                  ? 'border-gray-600 hover:border-gray-500 text-gray-400'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <FaImage />
              <span>Agregar imágenes</span>
            </label>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors font-semibold"
          >
            {editingReview ? 'Actualizar reseña' : 'Publicar reseña'}
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
      ) : !reviews || reviews.length === 0 ? (
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
                {user && user.userId === review.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      title="Editar"
                    >
                      <FaEdit className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.commentId)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      title="Eliminar"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap mb-3`}>
                {review.content}
              </p>

              {review.mediaUrls && review.mediaUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {review.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                      onClick={() => window.open(url, '_blank')}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-600">
                <button
                  onClick={() => handleToggleHelpful(review.commentId, true)}
                  className={`flex items-center gap-1 ${
                    user && review.helpfulVotes?.includes(user.userId)
                      ? 'text-emerald-500'
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <FaThumbsUp />
                  <span className="text-sm">{review.helpfulVotes?.length || 0}</span>
                </button>
                
                <button
                  onClick={() => handleToggleHelpful(review.commentId, false)}
                  className={`flex items-center gap-1 ${
                    user && review.unhelpfulVotes?.includes(user.userId)
                      ? 'text-red-500'
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <FaThumbsDown />
                  <span className="text-sm">{review.unhelpfulVotes?.length || 0}</span>
                </button>

                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === review.commentId ? null : review.commentId);
                    if (!replies[review.commentId]) {
                      loadReplies(review.commentId);
                    }
                  }}
                  className={`flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
                >
                  <FaReply />
                  <span className="text-sm">Responder</span>
                </button>
              </div>

              {replyingTo === review.commentId && (
                <div className="mt-3 pl-4 border-l-2 border-emerald-500">
                  <textarea
                    placeholder="Escribe tu respuesta..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleReply(review.commentId, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    Presiona Ctrl+Enter para enviar
                  </p>
                </div>
              )}

              {replies[review.commentId] && replies[review.commentId].length > 0 && (
                <div className="mt-4 pl-6 space-y-3">
                  {replies[review.commentId].map((reply) => (
                    <div
                      key={reply.commentId}
                      className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    >
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {reply.content}
                      </p>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
