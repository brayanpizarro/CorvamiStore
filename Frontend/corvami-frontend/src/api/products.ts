const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** Forma exacta que devuelve GET /productos desde el backend (Inventario.Producto) */
interface RawProduct {
  id: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock_actual: number;
  stock_minimo?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Interfaz normalizada que usa el frontend */
export interface Product {
  productId: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  codigo?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export { Product as default };

function mapProduct(raw: RawProduct): Product {
  return {
    productId: String(raw.id),
    name: raw.nombre,
    price: Number(raw.precio),
    description: raw.descripcion,
    stock: raw.stock_actual ?? 0,
    codigo: raw.codigo,
    imageUrl: undefined,
    isActive: (raw.stock_actual ?? 0) > 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export const productApi = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    const raw: RawProduct[] = await res.json();
    return raw.map(mapProduct);
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/productos/${id}`);
    if (!res.ok) throw new Error('Error al obtener producto');
    const raw: RawProduct = await res.json();
    return mapProduct(raw);
  },

  async create(data: Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const res = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    const raw: RawProduct = await res.json();
    return mapProduct(raw);
  },
};

