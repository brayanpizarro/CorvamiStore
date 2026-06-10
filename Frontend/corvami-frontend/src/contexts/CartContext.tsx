import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';

export interface CartItem {
  productId: string;
  name?: string;
  unitPrice?: number;
  price?: number; // alias de unitPrice por compatibilidad
  quantity: number;
  image?: string;
}

interface CartState {
  id: string; // sessionId
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
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'corvami_cart';
const SESSION_KEY = 'cart_session_id';

function ensureSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function loadFromStorage(sessionId: string): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: CartState = JSON.parse(raw);
      if (parsed.id === sessionId) return parsed;
    }
  } catch {
    // carrito no existe aún, usar vacío
    return { id: sessionId, items: [], currency: 'COP', totalPrice: 0, totalItems: 0 };
  }
  return { id: sessionId, items: [], currency: 'COP', totalPrice: 0, totalItems: 0 };
}

function computeTotals(items: CartItem[]): Pick<CartState, 'totalPrice' | 'totalItems'> {
  return {
    totalPrice: items.reduce((sum, i) => sum + (i.unitPrice ?? i.price ?? 0) * i.quantity, 0),
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

function saveToStorage(state: CartState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const CartProvider: React.FC<{ children: React.ReactNode; userId?: string }> = ({ children, userId }) => {
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(false);

  // Inicializar carrito desde localStorage
  useEffect(() => {
    const sessionId = userId || ensureSessionId();
    const stored = loadFromStorage(sessionId);
    setCart(stored);
  }, [userId]);

  const updateCart = useCallback((updater: (prev: CartState) => CartItem[]) => {
    setCart(prev => {
      if (!prev) return prev;
      const newItems = updater(prev);
      const next: CartState = {
        ...prev,
        items: newItems,
        ...computeTotals(newItems),
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setLoading(true);
    try {
      updateCart(prev => {
        const existing = prev.items.find(i => i.productId === item.productId);
        if (existing) {
          return prev.items.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev.items, {
          productId: item.productId,
          name: item.name,
          unitPrice: item.unitPrice ?? item.price,
          price: item.unitPrice ?? item.price,
          image: item.image,
          quantity,
        }];
      });
    } finally {
      setLoading(false);
    }
  }, [updateCart]);

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      updateCart(prev => {
        if (quantity <= 0) return prev.items.filter(i => i.productId !== productId);
        return prev.items.map(i => i.productId === productId ? { ...i, quantity } : i);
      });
    } finally {
      setLoading(false);
    }
  }, [updateCart]);

  const removeItem = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      updateCart(prev => prev.items.filter(i => i.productId !== productId));
    } finally {
      setLoading(false);
    }
  }, [updateCart]);

  const clear = useCallback(async () => {
    setLoading(true);
    try {
      updateCart(() => []);
    } finally {
      setLoading(false);
    }
  }, [updateCart]);

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clear, clearCart: clear, loading }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}

