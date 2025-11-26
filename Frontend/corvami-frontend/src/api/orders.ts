import { getAuthToken } from './auth';

const API_URL = 'http://localhost:3000';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface Order {
  orderId: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  shippingInfo: ShippingInfo;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Obtener todas las órdenes del usuario autenticado
export const getMyOrders = async (): Promise<Order[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener órdenes');
  }

  return await response.json();
};

// Obtener una orden específica
export const getOrder = async (orderId: string): Promise<Order> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener orden');
  }

  return await response.json();
};
