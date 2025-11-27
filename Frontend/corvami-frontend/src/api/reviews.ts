import { getAuthToken } from './auth';

const API_URL = 'http://localhost:3000';

export interface Review {
  commentId: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  mediaUrls?: string[];
  helpfulVotes?: string[];
  unhelpfulVotes?: string[];
  parentCommentId?: string;
  status: 'pending' | 'published' | 'hidden' | 'reported';
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userEmail?: string;
  repliesCount?: number;
}

export interface CreateReviewData {
  userId: string;
  rating: number;
  title?: string;
  content: string;
  mediaUrls?: string[];
  parentCommentId?: string;
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
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/productos/${productId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
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

    const data = await response.json();
    
    // Mapear la respuesta del backend al formato esperado por el frontend
    return {
      averageRating: data.avg || 0,
      totalReviews: data.count || 0,
      ratingDistribution: data.histogram || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  },

  updateReview: async (
    productId: string,
    commentId: string,
    data: { rating?: number; title?: string; content?: string; mediaUrls?: string[] }
  ): Promise<Review> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la reseña');
    }

    return response.json();
  },

  deleteReview: async (productId: string, commentId: string): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la reseña');
    }
  },

  markHelpful: async (productId: string, commentId: string): Promise<any> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}/helpful`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar como útil');
    }

    return response.json();
  },

  markUnhelpful: async (productId: string, commentId: string): Promise<any> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}/unhelpful`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar como no útil');
    }

    return response.json();
  },

  getReplies: async (productId: string, commentId: string): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/productos/${productId}/comments/${commentId}/replies`);

    if (!response.ok) {
      throw new Error('Error al obtener respuestas');
    }

    return response.json();
  },
};

