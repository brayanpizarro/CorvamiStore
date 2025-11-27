const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Product {
  _id: string;
  productId: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  tags?: string[];
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export { Product as default };

export const productApi = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/productos/${id}`);
    if (!res.ok) throw new Error('Error al obtener producto');
    return res.json();
  },

  async create(data: Omit<Product, '_id' | 'productId' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const res = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return res.json();
  },
};
