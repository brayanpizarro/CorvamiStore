import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { ChevronDown, Star, Heart, ShoppingCart } from 'lucide-react';
import ProductDetail from './ProductDetail';
import { productApi, type Product as ApiProduct } from '../api/products';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  subcategory: string;
  features: string[];
  inStock: boolean;
  discount?: number;
  description?: string;
  specifications?: Record<string, string>;
  warranty?: string;
  stockQuantity?: number;
}

interface CategoryProductsProps {
  category: string;
  categoryTitle: string;
  onNavigateHome?: () => void;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ category, categoryTitle, onNavigateHome }) => {
  const { theme } = useTheme();
  const { addItem, loading: cartLoading } = useCart();
  
  // Estados para filtros y vista
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }, 1);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    }
  };

  // Convertir productos de API a formato interno
  const allProducts: Product[] = useMemo(() => products.map(p => ({
    id: p.productId,
    name: p.name,
    price: p.price,
    image: p.imageUrl || 'https://via.placeholder.com/400',
    images: [p.imageUrl || 'https://via.placeholder.com/400'],
    rating: 4.5,
    reviews: 50,
    brand: p.brand || 'Sin marca',
    category: p.category || 'Sin categoría',
    subcategory: p.category || 'Sin categoría',
    features: [p.description || 'Sin descripción'],
    inStock: p.stock > 0,
    description: p.description,
    stockQuantity: p.stock,
  })), [products]);

  // Obtener marcas únicas
  const brands = useMemo(() => {
    return Array.from(new Set(allProducts.map(p => p.brand))).sort();
  }, [allProducts]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      // Filtro por categoría (comparación exacta, ya viene normalizada desde CategoryPage)
      // Si category es 'all', mostrar todos los productos
      if (category !== 'all' && product.category !== category) return false;
      

      
      // Filtro por rango de precio
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      // Filtro por marcas seleccionadas
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      
      // Filtro por rating
      if (selectedRating > 0 && product.rating < selectedRating) return false;
      
      return true;
    });

    // Ordenar productos
    switch (sortBy) {
      case 'price_asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default: // relevance
        return filtered;
    }
  }, [allProducts, category, priceRange, selectedBrands, selectedRating, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setPriceRange([0, 2000000]);
    setSelectedBrands([]);
    setSelectedRating(0);
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedRating > 0 || priceRange[1] < 5000000;

  // Mostrar loading
  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Si hay un producto seleccionado, mostrar el detalle
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={(quantity) => {
          console.log(`Agregando ${quantity} x ${selectedProduct.name} al carrito`);
          // Aquí irá la lógica del carrito
          setSelectedProduct(null); // Volver a la lista después de agregar
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Header de Categoría - Compacto */}
      <div className={`py-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botón de regreso */}
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className={`flex items-center gap-1.5 px-3 py-1.5 mb-3 rounded-lg text-sm font-medium transition-all hover:gap-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
            >
              <span>←</span>
              Volver
            </button>
          )}
          
          {/* Título y controles en la misma línea */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            {/* Título y contador */}
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {categoryTitle}
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {/* Controles compactos */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Botón de Filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  showFilters
                    ? theme === 'dark'
                      ? 'bg-green-500 text-black'
                      : 'bg-green-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                }`}
              >
                {/* <Filter size={16} /> */}
                🗤️ Filtros
                {hasActiveFilters && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    showFilters
                      ? 'bg-black/20'
                      : theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                  }`}>
                    {selectedBrands.length + (selectedRating > 0 ? 1 : 0) + (priceRange[1] < 5000000 ? 1 : 0)}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`text-xs font-medium underline ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  Limpiar
                </button>
              )}

              {/* Controles de Vista */}
              <div className={`flex border rounded-lg overflow-hidden ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2 py-1.5 text-xs transition-colors ${
                    viewMode === 'grid'
                      ? theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Vista en cuadrícula"
                >
                  {/* <Grid3X3 size={16} /> */}
                  ▦
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-1.5 text-xs transition-colors ${
                    viewMode === 'list'
                      ? theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Vista en lista"
                >
                  {/* <List size={16} /> */}
                  ≡
                </button>
              </div>

              {/* Ordenamiento */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`appearance-none pr-8 pl-3 py-1.5 rounded-lg border text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                >
                  <option value="relevance">Relevante</option>
                  <option value="price_asc">Menor precio</option>
                  <option value="price_desc">Mayor precio</option>
                  <option value="rating">Mejor calificación</option>
                  <option value="name">A-Z</option>
                </select>
                <ChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar de Filtros */}
          {showFilters && (
            <aside className={`w-full lg:w-80 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } rounded-xl p-4 h-fit lg:sticky lg:top-4 shadow-sm border ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Filtros
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Rango de Precio */}
              <div className={`mb-4 pb-4 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <h4 className={`font-semibold mb-3 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Rango de Precio
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 accent-green-500 cursor-pointer"
                  />
                  <div className={`flex items-center justify-between text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span>{formatPrice(0)}</span>
                    <span className={`px-3 py-1 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800 text-green-400' : 'bg-green-50 text-green-700'
                    }`}>
                      {formatPrice(priceRange[1])}
                    </span>
                  </div>
                </div>
              </div>

              {/* Marcas */}
              <div className={`mb-4 pb-4 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <h4 className={`font-semibold mb-3 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Marcas
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {brands.map(brand => (
                    <label key={brand} className={`flex items-center cursor-pointer group p-1.5 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 accent-green-500 cursor-pointer"
                      />
                      <span className={`ml-2 text-sm font-medium ${
                        selectedBrands.includes(brand)
                          ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      } group-hover:text-green-500 transition-colors`}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Calificación */}
              <div>
                <h4 className={`font-semibold mb-3 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Calificación Mínima
                </h4>
                <div className="space-y-2">
                  <label className={`flex items-center cursor-pointer group p-1.5 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === 0}
                      onChange={() => setSelectedRating(0)}
                      className="w-4 h-4 accent-green-500 cursor-pointer"
                    />
                    <span className={`ml-2 text-sm font-medium ${
                      selectedRating === 0
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Todas las calificaciones
                    </span>
                  </label>
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className={`flex items-center cursor-pointer group p-1.5 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="w-4 h-4 accent-green-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-2 ml-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-medium ${
                          selectedRating === rating
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          y más
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Grid/Lista de Productos */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className={`text-center py-16 px-4 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              } rounded-xl border ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className={`text-6xl mb-4 ${
                  theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  🔍
                </div>
                <p className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No se encontraron productos
                </p>
                <p className={`text-base ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Intenta ajustar los filtros o buscar en otra categoría
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className={`mt-6 px-6 py-2.5 rounded-lg font-medium ${
                      theme === 'dark'
                        ? 'bg-green-500 text-black hover:bg-green-400'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } transition-colors`}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredProducts.map(product => (
                  <article
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    } rounded-xl border ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    } overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                    } ${!product.inStock ? 'opacity-75' : ''}`}
                  >
                    {/* Imagen del Producto */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-full sm:w-56 flex-shrink-0' : ''
                    }`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                          viewMode === 'list' ? 'h-48 sm:h-full' : 'h-56'
                        }`}
                      />
                      
                      {/* Badge de Descuento */}
                      {product.discount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                          -{product.discount}%
                        </div>
                      )}
                      
                      {/* Estado de Stock */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                            Agotado
                          </span>
                        </div>
                      )}

                      {/* Botón de Favorito */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Lógica de favoritos aquí
                        }}
                        className={`absolute top-3 right-3 p-2.5 rounded-full ${
                          theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'
                        } hover:bg-red-500 hover:text-white transition-all hover:scale-110 group/heart shadow-lg`}
                        title="Agregar a favoritos"
                      >
                        <Heart size={18} className="group-hover/heart:fill-current" />
                      </button>
                    </div>

                    {/* Información del Producto */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 group-hover:text-green-500 transition-colors line-clamp-2 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } ${viewMode === 'list' ? 'text-lg' : 'text-base'}`}>
                          {product.name}
                        </h3>

                        <p className={`text-sm mb-3 font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {product.brand}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < Math.floor(product.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {product.rating} ({product.reviews})
                          </span>
                        </div>

                        {/* Características */}
                        {viewMode === 'list' && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.features.slice(0, 4).map((feature, index) => (
                              <span
                                key={index}
                                className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                                  theme === 'dark' 
                                    ? 'bg-gray-800 text-gray-300' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Precio y Botón */}
                      <div className="flex items-end justify-between gap-4 mt-auto">
                        <div>
                          <div className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice && (
                            <div className={`text-sm line-through ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Botón de Compra */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={!product.inStock || cartLoading}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            product.inStock && !cartLoading
                              ? theme === 'dark'
                                ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg hover:shadow-green-500/50'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-600/50'
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          } ${viewMode === 'grid' ? 'hover:scale-105' : ''}`}
                          title={product.inStock ? 'Agregar al carrito' : 'Producto agotado'}
                        >
                          <ShoppingCart size={18} />
                          {viewMode === 'list' && (cartLoading ? 'Agregando...' : 'Agregar')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;