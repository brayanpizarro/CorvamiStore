import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, Filter, Grid3X3, List, Star, Heart, ShoppingCart } from 'lucide-react';
import ProductDetail from './ProductDetail';

interface Product {
  id: number;
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
  specifications?: { [key: string]: string };
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
  
  // Estados para filtros y vista
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
      images: [
        "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      rating: 4.8,
      reviews: 342,
      brand: "Corsair",
      category: "perifericos",
      subcategory: "teclados",
      features: ["RGB Personalizable", "Switches Cherry MX", "Teclas Macro", "USB-C Extraíble"],
      inStock: true,
      discount: 18,
      description: "El Corsair K95 RGB es un teclado mecánico premium diseñado para gaming profesional. Con switches Cherry MX de alta calidad, iluminación RGB personalizable y construcción en aluminio, este teclado ofrece durabilidad y rendimiento excepcionales.",
      specifications: {
        "Tipo de Switch": "Cherry MX Red/Brown/Blue",
        "Retroiluminación": "RGB 16.8M colores",
        "Teclas Macro": "6 teclas dedicadas",
        "Material": "Aluminio cepillado",
        "Conectividad": "USB-C extraíble",
        "Dimensiones": "465 x 170 x 38 mm",
        "Peso": "1.2 kg"
      },
      warranty: "2 años",
      stockQuantity: 15
    },
    {
      id: 2,
      name: "Teclado Gaming Razer BlackWidow V3",
      price: 380000,
      originalPrice: 420000,
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      images: [
        "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      rating: 4.6,
      reviews: 218,
      brand: "Razer",
      category: "perifericos",
      subcategory: "teclados",
      features: ["Razer Green Switches", "RGB Chroma", "Reposamanos Magnético", "Cable Trenzado"],
      inStock: true,
      discount: 10,
      description: "El Razer BlackWidow V3 combina tecnología de switches mecánicos Razer con iluminación Chroma RGB avanzada para una experiencia gaming inmersiva.",
      specifications: {
        "Tipo de Switch": "Razer Green Mechanical",
        "Retroiluminación": "Razer Chroma RGB",
        "Material": "Plástico ABS Premium",
        "Conectividad": "USB 2.0",
        "Dimensiones": "440 x 145 x 42 mm"
      },
      warranty: "1 año",
      stockQuantity: 23
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

  const clearFilters = () => {
    setPriceRange([0, 2000000]);
    setSelectedBrands([]);
    setSelectedRating(0);
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedRating > 0 || priceRange[1] < 2000000;

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
                <Filter size={16} />
                Filtros
                {hasActiveFilters && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    showFilters
                      ? 'bg-black/20'
                      : theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                  }`}>
                    {selectedBrands.length + (selectedRating > 0 ? 1 : 0) + (priceRange[1] < 2000000 ? 1 : 0)}
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
                  className={`p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? theme === 'dark' ? 'bg-green-500 text-black' : 'bg-green-600 text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Vista en lista"
                >
                  <List size={16} />
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
                            // Lógica de agregar al carrito aquí
                            console.log('Agregado al carrito:', product.name);
                          }}
                          disabled={!product.inStock}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            product.inStock
                              ? theme === 'dark'
                                ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg hover:shadow-green-500/50'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-600/50'
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          } ${viewMode === 'grid' ? 'hover:scale-105' : ''}`}
                          title={product.inStock ? 'Agregar al carrito' : 'Producto agotado'}
                        >
                          <ShoppingCart size={18} />
                          {viewMode === 'list' && 'Agregar'}
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