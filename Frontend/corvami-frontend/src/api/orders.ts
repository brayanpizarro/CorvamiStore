import { getAuthToken } from './auth';

const API_URL = 'http://localhost:3000';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  zipCode?: string;
  isGuest: boolean;
  userId?: string;
}

export interface CreateOrderData {
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  notes?: string;
}

export interface ProcessPaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
  paymentMethod?: string;
}

export interface Order {
  id: string;
  orderId?: string; // El backend devuelve orderId
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  shippingCost?: number; // El backend usa shippingCost
  total: number;
  status: string;
  isPaid?: boolean;
  paymentMethod?: string;
  payment?: {
    method: string;
    transactionId: string;
    status: string;
    paidAt?: Date;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  shippingInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    department: string;
    zipCode?: string;
  };
}

// Helper para normalizar la orden del backend
const normalizeOrder = (order: any): Order => {
  return {
    ...order,
    id: order.orderId || order.id,
    shipping: order.shippingCost || order.shipping || 0,
    customer: order.shippingInfo ? {
      name: order.shippingInfo.name,
      email: order.shippingInfo.email,
      phone: order.shippingInfo.phone,
      address: order.shippingInfo.address,
      city: order.shippingInfo.city,
      department: order.shippingInfo.department,
      zipCode: order.shippingInfo.zipCode,
      isGuest: !order.userId,
      userId: order.userId,
    } : order.customer,
    items: order.items.map((item: any) => ({
      ...item,
      unitPrice: item.unitPrice || item.price,
    })),
  };
};

export const ordersApi = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Error al crear la orden');
    }

    const order = await response.json();
    return normalizeOrder(order);
  },

  processPayment: async (orderId: string, paymentData: ProcessPaymentData): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar el pago');
    }

    const order = await response.json();
    return normalizeOrder(order);
  },

  processBalancePayment: async (orderId: string): Promise<Order> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}/payment/balance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar el pago con saldo');
    }

    const order = await response.json();
    return normalizeOrder(order);
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la orden');
    }

    const order = await response.json();
    return normalizeOrder(order);
  },

  getOrdersByEmail: async (email: string): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/orders?email=${email}`);

    if (!response.ok) {
      throw new Error('Error al obtener las órdenes');
    }

    const orders = await response.json();
    return orders.map(normalizeOrder);
  },
};

// Función para obtener las órdenes del usuario autenticado
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

  const orders = await response.json();
  return orders.map(normalizeOrder);
};

// Cache bust: 638997739330754016
