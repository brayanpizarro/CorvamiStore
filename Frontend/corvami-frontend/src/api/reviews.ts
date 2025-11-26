const API_URL = 'http://localhost:3000';

export interface Review {
  commentId: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  mediaUrls?: string[];
  status: 'pending' | 'published' | 'hidden' | 'reported';
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userEmail?: string;
}

export interface CreateReviewData {
  userId: string;
  rating: number;
  title?: string;
  content: string;
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export const reviewsApi = {
  createReview: async (productId: string, reviewData: CreateReviewData): Promise<Review> => {
    const response = await fetch(`${API_URL}/productos/${productId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('Error al crear la reseña');
    }

    return response.json();
  },

  getReviews: async (
    productId: string,
    page = 1,
    limit = 10,
    sort: 'new' | 'top' = 'new'
  ): Promise<{ reviews: Review[]; total: number; page: number; totalPages: number }> => {
    const response = await fetch(
      `${API_URL}/productos/${productId}/comments?page=${page}&limit=${limit}&sort=${sort}`
    );

    if (!response.ok) {
      throw new Error('Error al obtener las reseñas');
    }

    return response.json();
  },

  getReviewsSummary: async (productId: string): Promise<ReviewsSummary> => {
    const response = await fetch(`${API_URL}/productos/${productId}/comments/summary`);

    if (!response.ok) {
      throw new Error('Error al obtener el resumen de reseñas');
    }

    return response.json();
  },

  updateReview: async (
    productId: string,
    commentId: string,
    data: { rating?: number; title?: string; content?: string }
  ): Promise<Review> => {
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la reseña');
    }

    return response.json();
  },

  deleteReview: async (productId: string, commentId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la reseña');
    }
  },
};
