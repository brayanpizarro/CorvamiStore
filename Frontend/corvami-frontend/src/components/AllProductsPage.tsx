import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineAppstore, AiOutlineBars } from 'react-icons/ai';
import ProductDetail from './ProductDetail';
import Header from './Header';
import Footer from './Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
  brand?: string;
  subcategory?: string;
  features?: string[];
}

const AllProductsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems] = useState(0);

  // Productos de ejemplo (puedes conectar esto con tu API)
  const allProducts: Product[] = [
    { id: 1, name: "Laptop Gamer ROG", price: 1299.99, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500", category: "Laptops", rating: 4.8, reviews: 156, inStock: true, discount: 15 },
    { id: 2, name: "Mouse Logitech G502", price: 79.99, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500", category: "Periféricos", rating: 4.9, reviews: 342, inStock: true },
    { id: 3, name: "Teclado Mecánico RGB", price: 129.99, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500", category: "Periféricos", rating: 4.7, reviews: 234, inStock: true, discount: 10 },
    { id: 4, name: "Monitor 4K 27\"", price: 399.99, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500", category: "Componentes", rating: 4.6, reviews: 189, inStock: true },
    { id: 5, name: "Audífonos Sony WH-1000XM5", price: 349.99, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500", category: "Audio", rating: 4.9, reviews: 567, inStock: true },
    { id: 6, name: "iPhone 15 Pro Max", price: 1199.99, image: "https://images.unsplash.com/photo-1592286927505-b0a67b3b2c39?w=500", category: "Móviles", rating: 4.8, reviews: 892, inStock: true, discount: 5 },
    { id: 7, name: "PlayStation 5", price: 499.99, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500", category: "Gaming", rating: 4.9, reviews: 1234, inStock: false },
    { id: 8, name: "MacBook Pro M3", price: 1999.99, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", category: "Laptops", rating: 4.9, reviews: 678, inStock: true },
    { id: 9, name: "AMD Ryzen 9 7950X", price: 599.99, image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500", category: "Componentes", rating: 4.8, reviews: 345, inStock: true },
    { id: 10, name: "SSD Samsung 2TB", price: 189.99, image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500", category: "Componentes", rating: 4.7, reviews: 456, inStock: true, discount: 20 },
    { id: 11, name: "Webcam Logitech C920", price: 89.99, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500", category: "Periféricos", rating: 4.6, reviews: 234, inStock: true },
    { id: 12, name: "RTX 4090 Gaming", price: 1599.99, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500", category: "Componentes", rating: 4.9, reviews: 789, inStock: true },
  ];

  const categories = ['all', 'Laptops', 'Gaming', 'Periféricos', 'Componentes', 'Audio', 'Móviles'];

  // Filtrar y ordenar productos
  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (selectedProduct) {
    // Asegurar que el producto tenga todos los campos requeridos
    const fullProduct = {
      ...selectedProduct,
      brand: selectedProduct.brand || 'Generic',
      subcategory: selectedProduct.subcategory || selectedProduct.category,
      features: selectedProduct.features || []
    };
    return <ProductDetail product={fullProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <>
      <Header 
        cartItems={cartItems}
        onNavigateHome={() => navigate('/')}
        currentPage="products"
      />
      <div className={`min-h-screen pt-20 pb-12 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-black via-gray-900 to-black'
          : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Todos los <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Productos</span>
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Explora nuestro catálogo completo de productos tecnológicos
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <AiOutlineSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                  }`}
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 text-white focus:border-green-400 focus:ring-green-400/50'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-400 focus:ring-green-400/20'
              }`}
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="name">Nombre A-Z</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-green-500/20 border-green-400 text-green-400'
                    : theme === 'dark'
                    ? 'border-gray-700 text-gray-400 hover:border-green-400/50'
                    : 'border-gray-300 text-gray-600 hover:border-green-400/50'
                }`}
              >
                <AiOutlineAppstore size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-green-500/20 border-green-400 text-green-400'
                    : theme === 'dark'
                    ? 'border-gray-700 text-gray-400 hover:border-green-400/50'
                    : 'border-gray-300 text-gray-600 hover:border-green-400/50'
                }`}
              >
                <AiOutlineBars size={20} />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                showFilters
                  ? 'bg-green-500/20 border-green-400 text-green-400'
                  : theme === 'dark'
                  ? 'border-gray-700 text-gray-400 hover:border-green-400/50'
                  : 'border-gray-300 text-gray-600 hover:border-green-400/50'
              }`}
            >
              <AiOutlineFilter size={20} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className={`p-6 rounded-lg border-2 ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white border-gray-300'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div>
                  <h3 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Categorías
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedCategory === cat
                            ? 'bg-green-500/20 border-green-400 text-green-400'
                            : theme === 'dark'
                            ? 'border-gray-700 text-gray-400 hover:border-green-400/50'
                            : 'border-gray-300 text-gray-600 hover:border-green-400/50'
                        }`}
                      >
                        {cat === 'all' ? 'Todas' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Rango de Precio
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Hasta ${priceRange[1].toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Mostrando {filteredProducts.length} de {allProducts.length} productos
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`backdrop-blur-sm rounded-xl border-2 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/60 hover:shadow-green-500/25'
                  : 'bg-white/80 border-green-400/40 hover:border-green-500/60 hover:shadow-green-400/25'
              } ${viewMode === 'list' ? 'flex' : ''}`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'h-56'}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Agotado</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {product.category}
                </p>
                <h3 className={`font-bold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount ? (
                      <>
                        <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          ${product.price.toFixed(2)}
                        </span>
                        <p className="text-xl font-bold text-green-400">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-green-400">${product.price.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No se encontraron productos que coincidan con tu búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AllProductsPage;
