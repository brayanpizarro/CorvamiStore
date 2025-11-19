import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useTheme } from '../contexts/ThemeContext';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
}

interface ProductsSectionProps {
  onAddToCart: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ onAddToCart }) => {
  const { theme } = useTheme();
  
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Laptop Gaming RTX 4080",
      price: 100000,
      originalPrice: 149000,
      image: " ",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Teclado Mecánico RGB",
      price: 59000,
      originalPrice: 89990,
      image: " ",
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Mouse Gaming Pro",
      price: 39990,
      originalPrice: 25000,
      image: " ",
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: "RAM 32GB DDR5",
      price: 125990,
      originalPrice: 249990,
      image: " ",
      rating: 4.6,
      reviews: 73
    }
  ];

  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/30'
        }`}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 ${
          theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-500/25'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Productos</span> Destacados
          </h2>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Los más vendidos con ofertas especiales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className={`backdrop-blur-sm rounded-xl border-2 shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/60 hover:bg-gray-700/70 hover:shadow-green-500/25'
                : 'bg-white/80 border-green-400/40 hover:border-green-500/70 hover:bg-white/90 hover:shadow-green-400/30'
            }`}>
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-green-400">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar key={i} size={16} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-400"} />
                    ))}
                  </div>
                  <span className={`text-sm ml-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>({product.reviews})</span>
                </div>
                <h3 className={`font-bold mb-2 group-hover:text-green-300 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-400">${product.price}</span>
                    <span className={`text-lg line-through ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>${product.originalPrice}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onAddToCart()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;