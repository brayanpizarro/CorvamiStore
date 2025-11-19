import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';

export interface CartItem {
  productId: string;
  name?: string;
  unitPrice?: number;
  price?: number; // Mantener por compatibilidad
  quantity: number;
  image?: string;
}

interface CartState {
  id: string; // userId o sessionId
  items: CartItem[];
  currency: string;
  totalPrice: number;
  totalItems: number;
}

interface CartContextValue {
  cart: CartState | null;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const STORAGE_KEY = 'cart_session_id';

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export const CartProvider: React.FC<{ children: React.ReactNode; userId?: string }> = ({ children, userId }) => {
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(false);

  // Obtener/crear ID de sesión
  const ensureSessionId = () => {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  };

  const loadCart = useCallback(async () => {
    const baseId = userId || ensureSessionId();
    try {
      const data = await fetchJSON(`${API_BASE}/cart/${baseId}`);
      if (data && data.id) {
        setCart(data);
      } else {
        // crear carrito vacío si no existe
        const payload = userId ? { userId } : { sessionId: baseId };
        const created = await fetchJSON(`${API_BASE}/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setCart(created);
      }
    } catch (e) {
      // intento de crear si falla get
      const payload = userId ? { userId } : { sessionId: baseId };
      const created = await fetchJSON(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setCart(created);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const syncCart = async (id: string) => {
    const data = await fetchJSON(`${API_BASE}/cart/${id}`);
    setCart(data);
  };

  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    if (!cart) return;
    setLoading(true);
    try {
      await fetchJSON(`${API_BASE}/cart/${cart.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: item.productId, 
          quantity,
          unitPrice: item.price,
          name: item.name,
          image: item.image,
        }),
      });
      await syncCart(cart.id);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      await fetchJSON(`${API_BASE}/cart/${cart.id}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      await syncCart(cart.id);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (productId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      await fetchJSON(`${API_BASE}/cart/${cart.id}/items/${productId}`, { method: 'DELETE' });
      await syncCart(cart.id);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const clear = useCallback(async () => {
    if (!cart) return;
    setLoading(true);
    try {
      await fetchJSON(`${API_BASE}/cart/${cart.id}`, { method: 'DELETE' });
      await syncCart(cart.id);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clear, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
