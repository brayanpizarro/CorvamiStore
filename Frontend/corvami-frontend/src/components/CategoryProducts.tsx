import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, Filter, Grid3X3, List, Star, Heart, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  subcategory: string;
  features: string[];
  inStock: boolean;
  discount?: number;
}

interface CategoryProductsProps {
  category: string;
  categoryTitle: string;
  onNavigateHome?: () => void;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ category, categoryTitle, onNavigateHome }) => {
  const { theme } = useTheme();
  
  // Estados para filtros y vista
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const [showFilters, setShowFilters] = useState(false);

  // Datos mock de productos (en una app real vendría de una API)
  const allProducts: Product[] = useMemo(() => [
    {
      id: 1,
      name: "Teclado Mecánico RGB Corsair K95",
      price: 450000,
      originalPrice: 550000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 342,
      brand: "Corsair",
      category: "perifericos",
      subcategory: "teclados",
      features: ["RGB", "Mecánico", "Cherry MX", "USB-C"],
      inStock: true,
      discount: 18
    },
    {
      id: 2,
      name: "Teclado Gaming Razer BlackWidow V3",
      price: 380000,
      originalPrice: 420000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 218,
      brand: "Razer",
      category: "perifericos",
      subcategory: "teclados",
      features: ["RGB", "Mecánico", "Razer Green", "USB"],
      inStock: true,
      discount: 10
    },
    {
      id: 3,
      name: "Teclado Logitech MX Keys",
      price: 320000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.4,
      reviews: 156,
      brand: "Logitech",
      category: "perifericos",
      subcategory: "teclados",
      features: ["Inalámbrico", "Bluetooth", "USB-C", "Retroiluminado"],
      inStock: true
    },
    {
      id: 4,
      name: "Teclado Steelseries Apex Pro",
      price: 520000,
      originalPrice: 600000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 89,
      brand: "Steelseries",
      category: "perifericos",
      subcategory: "teclados",
      features: ["OLED Display", "Mecánico", "RGB", "USB"],
      inStock: false,
      discount: 13
    },
    {
      id: 5,
      name: "Teclado HyperX Alloy FPS Pro",
      price: 280000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.5,
      reviews: 203,
      brand: "HyperX",
      category: "perifericos",
      subcategory: "teclados",
      features: ["Mecánico", "Compacto", "Cherry MX", "LED Rojo"],
      inStock: true
    },
    {
      id: 6,
      name: "Teclado ASUS ROG Strix Scope",
      price: 410000,
      originalPrice: 480000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      reviews: 167,
      brand: "ASUS",
      category: "perifericos",
      subcategory: "teclados",
      features: ["RGB", "Mecánico", "Cherry MX Red", "USB"],
      inStock: true,
      discount: 15
    },

    // RATONES
    {
      id: 7,
      name: "Mouse Gaming Logitech G Pro X Superlight",
      price: 350000,
      originalPrice: 400000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 456,
      brand: "Logitech",
      category: "perifericos",
      subcategory: "ratones",
      features: ["Inalámbrico", "25600 DPI", "63g", "HERO Sensor"],
      inStock: true,
      discount: 12
    },
    {
      id: 8,
      name: "Mouse Razer DeathAdder V3 Pro",
      price: 320000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 234,
      brand: "Razer",
      category: "perifericos",
      subcategory: "ratones",
      features: ["Inalámbrico", "30000 DPI", "Focus Pro Sensor", "RGB"],
      inStock: true
    },
    {
      id: 9,
      name: "Mouse Corsair Dark Core RGB Pro SE",
      price: 280000,
      originalPrice: 320000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.4,
      reviews: 189,
      brand: "Corsair",
      category: "perifericos",
      subcategory: "ratones",
      features: ["Inalámbrico", "18000 DPI", "Qi Wireless", "RGB"],
      inStock: true,
      discount: 13
    },
    {
      id: 10,
      name: "Mouse SteelSeries Rival 650",
      price: 260000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.3,
      reviews: 145,
      brand: "Steelseries",
      category: "perifericos",
      subcategory: "ratones",
      features: ["12000 DPI", "Peso Ajustable", "RGB", "Cable"],
      inStock: true
    },

    // AUDÍFONOS
    {
      id: 11,
      name: "Audífonos Gaming HyperX Cloud III",
      price: 420000,
      originalPrice: 480000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      reviews: 312,
      brand: "HyperX",
      category: "audio",
      subcategory: "audifonos",
      features: ["7.1 Surround", "Micrófono", "Cómodos", "Multi-plataforma"],
      inStock: true,
      discount: 12
    },
    {
      id: 12,
      name: "Audífonos Razer BlackShark V2 Pro",
      price: 380000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.5,
      reviews: 267,
      brand: "Razer",
      category: "audio",
      subcategory: "audifonos",
      features: ["Inalámbrico", "THX Spatial Audio", "Micrófono", "50mm Drivers"],
      inStock: true
    },
    {
      id: 13,
      name: "Audífonos Logitech G935",
      price: 340000,
      originalPrice: 390000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.4,
      reviews: 198,
      brand: "Logitech",
      category: "audio",
      subcategory: "audifonos",
      features: ["Inalámbrico", "RGB", "7.1 Surround", "Micrófono"],
      inStock: true,
      discount: 13
    },
    {
      id: 14,
      name: "Audífonos SteelSeries Arctis 7P",
      price: 300000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 223,
      brand: "Steelseries",
      category: "audio",
      subcategory: "audifonos",
      features: ["Inalámbrico", "PS5 Compatible", "Micrófono", "24hrs Batería"],
      inStock: false
    },

    // LAPTOPS
    {
      id: 15,
      name: "Laptop Gaming ASUS ROG Strix G15",
      price: 4200000,
      originalPrice: 4800000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 89,
      brand: "ASUS",
      category: "computadoras",
      subcategory: "laptops",
      features: ["RTX 4060", "AMD Ryzen 7", "16GB RAM", "512GB SSD"],
      inStock: true,
      discount: 12
    },
    {
      id: 16,
      name: "Laptop HP Pavilion Gaming",
      price: 3800000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.4,
      reviews: 156,
      brand: "HP",
      category: "computadoras",
      subcategory: "laptops",
      features: ["GTX 1650", "Intel i5", "8GB RAM", "256GB SSD"],
      inStock: true
    },
    {
      id: 17,
      name: "MacBook Pro 14 M3",
      price: 8500000,
      originalPrice: 9200000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 234,
      brand: "Apple",
      category: "computadoras",
      subcategory: "laptops",
      features: ["M3 Chip", "16GB RAM", "512GB SSD", "Retina Display"],
      inStock: true,
      discount: 8
    },
    {
      id: 18,
      name: "Laptop Dell XPS 13",
      price: 4500000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 178,
      brand: "Dell",
      category: "computadoras",
      subcategory: "laptops",
      features: ["Intel i7", "16GB RAM", "512GB SSD", "13.3 4K"],
      inStock: true
    },

    // MONITORES
    {
      id: 19,
      name: "Monitor Gaming ASUS TUF 27 144Hz",
      price: 1200000,
      originalPrice: 1400000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      reviews: 267,
      brand: "ASUS",
      category: "perifericos",
      subcategory: "monitores",
      features: ["27 pulgadas", "144Hz", "Full HD", "1ms"],
      inStock: true,
      discount: 14
    },
    {
      id: 20,
      name: "Monitor LG UltraGear 32 4K",
      price: 2800000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 145,
      brand: "LG",
      category: "perifericos",
      subcategory: "monitores",
      features: ["32 pulgadas", "4K", "160Hz", "G-Sync"],
      inStock: true
    },
    {
      id: 21,
      name: "Monitor Samsung Odyssey G7",
      price: 2200000,
      originalPrice: 2500000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 189,
      brand: "Samsung",
      category: "perifericos",
      subcategory: "monitores",
      features: ["27 pulgadas", "240Hz", "Curvo", "QHD"],
      inStock: true,
      discount: 12
    },

    // SMARTPHONES
    {
      id: 22,
      name: "iPhone 15 Pro Max 256GB",
      price: 5800000,
      originalPrice: 6200000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 456,
      brand: "Apple",
      category: "moviles",
      subcategory: "smartphones",
      features: ["A17 Pro", "256GB", "48MP", "Titanio"],
      inStock: true,
      discount: 6
    },
    {
      id: 23,
      name: "Samsung Galaxy S24 Ultra",
      price: 5200000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 334,
      brand: "Samsung",
      category: "moviles",
      subcategory: "smartphones",
      features: ["Snapdragon 8 Gen 3", "256GB", "200MP", "S Pen"],
      inStock: true
    },
    {
      id: 24,
      name: "Google Pixel 8 Pro",
      price: 4200000,
      originalPrice: 4600000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      reviews: 234,
      brand: "Google",
      category: "moviles",
      subcategory: "smartphones",
      features: ["Tensor G3", "128GB", "50MP", "AI Features"],
      inStock: true,
      discount: 9
    },

    // TABLETS
    {
      id: 25,
      name: "iPad Pro 12.9 M2 256GB",
      price: 4800000,
      originalPrice: 5200000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 189,
      brand: "Apple",
      category: "moviles",
      subcategory: "tablets",
      features: ["M2 Chip", "256GB", "12.9 pulgadas", "Liquid Retina"],
      inStock: true,
      discount: 8
    },
    {
      id: 26,
      name: "Samsung Galaxy Tab S9 Ultra",
      price: 4200000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 156,
      brand: "Samsung",
      category: "moviles",
      subcategory: "tablets",
      features: ["Snapdragon 8 Gen 2", "256GB", "14.6 pulgadas", "S Pen"],
      inStock: true
    },

    // COMPONENTES
    {
      id: 27,
      name: "Tarjeta Gráfica RTX 4070 Ti",
      price: 3200000,
      originalPrice: 3600000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 267,
      brand: "NVIDIA",
      category: "componentes",
      subcategory: "graficas",
      features: ["12GB GDDR6X", "Ray Tracing", "DLSS 3", "4K Gaming"],
      inStock: true,
      discount: 11
    },
    {
      id: 28,
      name: "Procesador AMD Ryzen 7 7700X",
      price: 1800000,
      image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      reviews: 234,
      brand: "AMD",
      category: "componentes",
      subcategory: "procesadores",
      features: ["8 Cores", "16 Threads", "5.4GHz", "AM5"],
      inStock: true
    },
    {
      id: 29,
      name: "Memoria RAM Corsair 32GB DDR5",
      price: 800000,
      originalPrice: 900000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 189,
      brand: "Corsair",
      category: "componentes",
      subcategory: "memorias",
      features: ["32GB", "DDR5-5600", "RGB", "Kit 2x16GB"],
      inStock: true,
      discount: 11
    },
    {
      id: 30,
      name: "SSD Samsung 980 PRO 2TB",
      price: 1200000,
      image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 345,
      brand: "Samsung",
      category: "componentes",
      subcategory: "almacenamiento",
      features: ["2TB", "NVMe", "7000 MB/s", "PCIe 4.0"],
      inStock: true
    }
  ], []);

  // Obtener marcas únicas
  const brands = useMemo(() => {
    return Array.from(new Set(allProducts.map(p => p.brand))).sort();
  }, [allProducts]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      // Filtro por categoría
      if (category !== 'all' && product.subcategory !== category) return false;
      

      
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

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Header de Categoría */}
      <div className={`py-8 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Botón de regreso */}
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">←</span>
                  Regresar
                </button>
              )}
              
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {categoryTitle}
                </h1>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {filteredProducts.length} productos encontrados
                </p>
              </div>
            </div>
            
            {/* Controles de Vista */}
            <div className="flex items-center gap-4">
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Ordenamiento */}
          <div className="flex justify-end">
            {/* Ordenamiento */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none pr-10 pl-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="relevance">Más Relevante</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificación</option>
                <option value="name">Nombre A-Z</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
            </div>

            {/* Botón de Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              } transition-colors`}
            >
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar de Filtros */}
          {showFilters && (
            <div className={`w-80 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } rounded-lg p-6 h-fit sticky top-8`}>
              <h3 className={`text-lg font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Filtros
              </h3>

              {/* Rango de Precio */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Precio
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-green-500"
                  />
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Hasta {formatPrice(priceRange[1])}
                  </div>
                </div>
              </div>

              {/* Marcas */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Marcas
                </h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="mr-2 accent-green-500"
                      />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Calificación */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Calificación Mínima
                </h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="mr-2 accent-green-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className={`text-sm ml-1 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          y más
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid/Lista de Productos */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p className="text-xl mb-4">No se encontraron productos</p>
                <p>Intenta ajustar los filtros o buscar algo diferente</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    } rounded-lg border ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    } overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Imagen del Producto */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'list' ? 'h-32' : 'h-48'
                        }`}
                      />
                      
                      {/* Badge de Descuento */}
                      {product.discount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          -{product.discount}%
                        </div>
                      )}
                      
                      {/* Estado de Stock */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded font-semibold">
                            Agotado
                          </span>
                        </div>
                      )}

                      {/* Botón de Favorito */}
                      <button className={`absolute top-3 right-3 p-2 rounded-full ${
                        theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
                      } hover:bg-red-500 hover:text-white transition-colors group/heart`}>
                        <Heart size={16} className="group-hover/heart:fill-current" />
                      </button>
                    </div>

                    {/* Información del Producto */}
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } group-hover:text-green-500 transition-colors ${
                          viewMode === 'list' ? 'text-lg' : ''
                        }`}>
                          {product.name}
                        </h3>
                      </div>

                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {product.brand}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Características */}
                      {viewMode === 'list' && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.features.slice(0, 4).map((feature, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs rounded ${
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

                      {/* Precio */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-xl font-bold ${
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
                          disabled={!product.inStock}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            product.inStock
                              ? theme === 'dark'
                                ? 'bg-green-500 hover:bg-green-400 text-black'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart size={16} />
                          {viewMode === 'list' ? 'Agregar' : ''}
                        </button>
                      </div>
                    </div>
                  </div>
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