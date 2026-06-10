const API_BASE = import.meta.env.VITE_API_URL ?? '';

/** Forma exacta que devuelve GET /productos desde el backend (Inventario.Producto) */
interface RawProduct {
  id: string;         // UUID
  codigo?: string;
  nombre: string;
  descripcion?: string;
  precio: number | string;
  stock_actual: number;
  stock_minimo?: number;
  categoria?: string;
  alerta_stock_minimo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Imagen de producto tal como la devuelve el backend */
interface RawProductImagen {
  id: number;
  productoId: string;
  imagenUrl: string;  // URL de Cloudinary
  publicId?: string;
  esPrincipal: boolean;
  createdAt: string;
}

/** Forma que devuelve GET /productos/con-imagenes */
interface RawProductWithImages extends RawProduct {
  imagenes?: RawProductImagen[];
  imagenPrincipal?: string; // URL directa de la imagen principal
}

const IVA_RATE = 0.19;

/** Interfaz normalizada que usa el frontend */
export interface Product {
  productId: string;
  name: string;
  /** Precio con IVA incluido (19%) — usar siempre este para mostrar al cliente */
  price: number;
  /** Precio base sin IVA — precio original del inventario */
  basePrice: number;
  /** Monto del IVA (19% del basePrice) */
  ivaAmount: number;
  description?: string;
  stock: number;
  codigo?: string;
  category?: string;
  imageUrl?: string;
  images?: { id: number; url: string; isPrincipal: boolean }[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type { Product as default };

function getProductId(raw: RawProduct): string {
  return String(raw.id ?? '');
}

function pickPrincipalImage(raw: RawProductWithImages): string | undefined {
  // Primero usar el campo directo imagenPrincipal si existe
  if (raw.imagenPrincipal) return raw.imagenPrincipal;
  if (!raw.imagenes || raw.imagenes.length === 0) return undefined;
  const principal = raw.imagenes.find((img) => img.esPrincipal);
  return (principal ?? raw.imagenes[0]).imagenUrl;
}

function mapProduct(raw: RawProductWithImages): Product {
  const images = raw.imagenes?.map((img) => ({
    id: img.id,
    url: img.imagenUrl,
    isPrincipal: img.esPrincipal,
  }));

  const basePrice = Number(raw.precio);
  const ivaAmount = Math.round(basePrice * IVA_RATE);
  const price = basePrice + ivaAmount;

  return {
    productId: getProductId(raw),
    name: raw.nombre,
    price,
    basePrice,
    ivaAmount,
    description: raw.descripcion,
    stock: raw.stock_actual ?? 0,
    codigo: raw.codigo,
    category: raw.categoria || 'Sin categoría',
    imageUrl: pickPrincipalImage(raw),
    images,
    isActive: (raw.stock_actual ?? 0) > 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export const productApi = {
  /** Obtiene todos los productos con sus imágenes de Cloudinary */
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/productos/con-imagenes`);
    if (!res.ok) throw new Error('Error al obtener productos');
    const raw: RawProductWithImages[] = await res.json();
    return raw.map(mapProduct);
  },

  /** Obtiene un producto con sus imágenes por ID */
  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/productos/${id}/con-imagenes`);
    if (!res.ok) {
      // fallback al endpoint básico si el con-imagenes falla
      const fallback = await fetch(`${API_BASE}/productos/${id}`);
      if (!fallback.ok) throw new Error('Error al obtener producto');
      const raw: RawProduct = await fallback.json();
      return mapProduct(raw);
    }
    const raw: RawProductWithImages = await res.json();
    return mapProduct(raw);
  },

  /** Obtiene solo las imágenes de un producto */
  async getImages(id: string): Promise<{ id: number; url: string; isPrincipal: boolean }[]> {
    const res = await fetch(`${API_BASE}/productos/${id}/imagenes`);
    if (!res.ok) return [];
    const raw: RawProductImagen[] = await res.json();
    return raw.map((img) => ({ id: img.id, url: img.imagenData, isPrincipal: img.esPrincipal }));
  },
};

