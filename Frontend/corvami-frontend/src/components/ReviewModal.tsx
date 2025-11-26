import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { reviewsApi } from '../api/reviews';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';

interface ReviewModalProps {
  productId: string;
  productName: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ productId, productName, userId, onClose, onSuccess }: ReviewModalProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('Por favor escribe tu reseña');
      return;
    }

    try {
      setSubmitting(true);
      await reviewsApi.createReview(productId, {
        userId,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
      });
      
      alert('¡Reseña publicada exitosamente!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Error al publicar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className="cursor-pointer hover:scale-125 transition-transform text-2xl"
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Escribe tu reseña
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FaTimes className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        {/* Product Info */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {productName}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Calificación
            </label>
            {renderStars(formData.rating, (rating) => setFormData({ ...formData, rating }))}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Título (opcional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={140}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500`}
              placeholder="Resumen de tu experiencia"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {formData.title.length}/140 caracteres
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Tu reseña *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-emerald-500`}
              placeholder="Cuéntanos sobre tu experiencia con este producto..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                submitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
              } text-white`}
            >
              {submitting ? 'Publicando...' : 'Publicar reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
