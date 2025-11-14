import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

interface CategoriesDropdownProps {
  onCategorySelect?: (categorySlug: string) => void;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ onCategorySelect }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const categories: Category[] = [
    {
      id: 'teclados',
      name: 'Teclados',
      subcategories: ['Mecánicos', 'Gaming', 'Inalámbricos', 'Compactos']
    },
    {
      id: 'ratones',
      name: 'Ratones',
      subcategories: ['Gaming', 'Inalámbricos', 'Ergonómicos', 'Profesionales']
    },
    {
      id: 'audifonos',
      name: 'Audífonos',
      subcategories: ['Gaming', 'Inalámbricos', 'Con Micrófono', 'Profesionales']
    },
    {
      id: 'laptops',
      name: 'Laptops',
      subcategories: ['Gaming', 'Workstation', 'Económicas']
    },
    {
      id: 'monitores',
      name: 'Monitores',
      subcategories: ['Gaming', '4K', 'Ultrawide', 'Profesionales']
    },
    {
      id: 'smartphones',
      name: 'Smartphones',
      subcategories: ['iPhone', 'Samsung', 'Android', 'Accesorios']
    },
    {
      id: 'tablets',
      name: 'Tablets',
      subcategories: ['iPad', 'Android', 'Accesorios']
    },
    {
      id: 'componentes',
      name: 'Componentes PC',
      subcategories: ['Procesadores', 'Tarjetas Gráficas', 'Memoria RAM', 'Almacenamiento']
    }
  ];

  return (
    <div className="relative">
      {/* Botón de Categorías */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-white hover:text-emerald-100 transition-colors font-medium"
      >
        <span>Categorías</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menú desplegable */}
          <div className={`absolute top-full left-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gray-900/95 border-green-500/30 shadow-green-500/20 backdrop-blur-md'
              : 'bg-white/95 border-gray-200 shadow-gray-200/50 backdrop-blur-md'
          }`}>
            <div className="p-4">
              
              <div className="grid gap-2">
                {categories.map((category) => {
                  return (
                    <div key={category.id} className="group">
                      {/* Categoría Principal */}
                      <button 
                        onClick={() => {
                          onCategorySelect?.(category.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800/70 hover:border-green-400/50 border border-transparent'
                          : 'hover:bg-gray-50 hover:border-green-200 border border-transparent'
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                        }`}>
                          {/* Placeholder icon */}
                          <div className={`w-4 h-4 rounded-sm ${
                            theme === 'dark' ? 'bg-green-400' : 'bg-green-600'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'
                          }`}>
                            {category.name}
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {category.subcategories?.length} subcategorías
                          </div>
                        </div>
                        <ChevronDown 
                          size={14} 
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`}
                        />
                      </button>
                      
                      {/* Subcategorías (se mostrarían en hover o click) */}
                      <div className="hidden group-hover:block pl-11 pb-2">
                        <div className="grid gap-1">
                          {category.subcategories?.map((sub) => (
                            <button
                              key={sub}
                              className={`text-left px-3 py-1 rounded text-sm transition-colors ${
                                theme === 'dark'
                                  ? 'text-gray-400 hover:text-green-400'
                                  : 'text-gray-600 hover:text-green-600'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Ver todas las categorías */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}>
                  Ver todas las categorías →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesDropdown;