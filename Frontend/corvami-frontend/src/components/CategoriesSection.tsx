import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { IoGameControllerOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { MdOutlineKeyboard, MdHeadphones } from 'react-icons/md';
import { BsCpu } from 'react-icons/bs';

interface CategoriesSectionProps {
  onCategoryClick?: (categorySlug: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategoryClick }) => {
  const { theme } = useTheme();

  const categories = [
    { 
      name: "Laptops", 
      icon: HiOutlineDesktopComputer, 
      count: 45, 
      slug: "laptops",
      subcategories: [
        { name: "Gaming", slug: "laptops-gaming" },
        { name: "Ultrabooks", slug: "laptops-ultrabooks" },
        { name: "Workstation", slug: "laptops-workstation" },
        { name: "Económicas", slug: "laptops-economicas" }
      ]
    },
    { 
      name: "Gaming", 
      icon: IoGameControllerOutline, 
      count: 32, 
      slug: "gaming",
      subcategories: [
        { name: "Consolas", slug: "gaming-consolas" },
        { name: "Controles", slug: "gaming-controles" },
        { name: "Juegos", slug: "gaming-juegos" },
        { name: "Accesorios", slug: "gaming-accesorios" }
      ]
    },
    { 
      name: "Periféricos", 
      icon: MdOutlineKeyboard, 
      count: 89, 
      slug: "perifericos",
      subcategories: [
        { name: "Teclados", slug: "perifericos-teclados" },
        { name: "Ratones", slug: "perifericos-ratones" },
        { name: "Webcams", slug: "perifericos-webcams" },
        { name: "Micrófonos", slug: "perifericos-microfonos" }
      ]
    },
    { 
      name: "Componentes", 
      icon: BsCpu, 
      count: 67, 
      slug: "componentes",
      subcategories: [
        { name: "Procesadores", slug: "componentes-procesadores" },
        { name: "Tarjetas Gráficas", slug: "componentes-gpu" },
        { name: "Memoria RAM", slug: "componentes-ram" },
        { name: "Almacenamiento", slug: "componentes-storage" }
      ]
    },
    { 
      name: "Audio", 
      icon: MdHeadphones, 
      count: 28, 
      slug: "audifonos",
      subcategories: [
        { name: "Audífonos Gaming", slug: "audio-gaming" },
        { name: "Audífonos Inalámbricos", slug: "audio-wireless" },
        { name: "Parlantes", slug: "audio-speakers" },
        { name: "Barras de Sonido", slug: "audio-soundbars" }
      ]
    },
    { 
      name: "Móviles", 
      icon: IoPhonePortraitOutline, 
      count: 54, 
      slug: "smartphones",
      subcategories: [
        { name: "Android", slug: "smartphones-android" },
        { name: "iPhone", slug: "smartphones-iphone" },
        { name: "Accesorios", slug: "smartphones-accesorios" },
        { name: "Smartwatches", slug: "smartphones-smartwatches" }
      ]
    }
  ];

  const handleCategoryClick = (categorySlug: string) => {
    onCategoryClick?.(categorySlug);
  };

  return (
    <section 
      id="categories-section"
      className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/30'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-500/25'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Explora por <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Categorías</span>
          </h2>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Encuentra exactamente lo que necesitas</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index}>
                <div 
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`backdrop-blur-sm rounded-xl p-6 text-center border-2 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/60 hover:bg-gray-700/70 hover:shadow-green-500/25'
                    : 'bg-white/80 border-green-400/40 hover:border-green-500/60 hover:bg-white/90 hover:shadow-green-400/25'
                }`}>
                  <div className="flex justify-center mb-3">
                    <IconComponent className={`text-5xl transition-transform duration-300 group-hover:scale-110 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <h3 className={`font-bold mb-1 group-hover:text-green-300 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{category.name}</h3>
                  <p className={`text-sm group-hover:text-green-400 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{category.count} productos</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;