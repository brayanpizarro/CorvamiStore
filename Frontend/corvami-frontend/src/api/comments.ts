import { getAuthToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export interface Comment {
  commentId: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  mediaUrls?: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  mediaUrls?: string[];
}

// Verificar si el usuario puede dejar reseña
export const canReviewProduct = async (productId: string): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/orders/can-review/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error('Error verificando permiso de reseña:', error);
    return false;
  }
};

// Crear comentario
export const createComment = async (data: CreateCommentData): Promise<Comment> => {
  const response = await fetch(`${API_URL}/productos/${data.productId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear comentario');
  }

  return await response.json();
};

// Obtener comentarios de un producto
export const getProductComments = async (
  productId: string,
  page = 1,
  limit = 10,
  sort: 'new' | 'top' = 'new'
): Promise<Comment[]> => {
  const response = await fetch(
    `${API_URL}/productos/${productId}/comments?page=${page}&limit=${limit}&sort=${sort}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener comentarios');
  }

  return await response.json();
};

// Obtener resumen de calificaciones
export const getRatingsSummary = async (productId: string) => {
  const response = await fetch(`${API_URL}/productos/${productId}/comments/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener resumen de calificaciones');
  }

  return await response.json();
};
