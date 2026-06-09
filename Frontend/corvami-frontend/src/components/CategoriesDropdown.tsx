import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

const CategoriesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories: Category[] = [
    {
      id: 'laptop',
      name: 'Laptops',
      subcategories: ['Gaming', 'Workstation', 'Económicas']
    },
    {
      id: 'teclado',
      name: 'Teclados',
      subcategories: ['Mecánicos', 'Gaming', 'Inalámbricos', 'Compactos']
    },
    {
      id: 'mouse',
      name: 'Ratones',
      subcategories: ['Gaming', 'Inalámbricos', 'Ergonómicos', 'Profesionales']
    },
    {
      id: 'monitor',
      name: 'Monitores',
      subcategories: ['Gaming', '4K', 'Ultrawide', 'Profesionales']
    },
    {
      id: 'audifonos',
      name: 'Audífonos',
      subcategories: ['Gaming', 'Inalámbricos', 'Con Micrófono', 'Profesionales']
    },
    {
      id: 'webcam',
      name: 'Webcams',
      subcategories: ['HD', 'Full HD', '4K', 'Con Micrófono']
    }
  ];

  return (
    <div className="relative">
      {/* Botón de Categorías */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
      >
        <span>Categorías</span>
        <MdKeyboardArrowDown 
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
          <div className="absolute top-full left-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 transition-all duration-300 bg-card/95 border-border shadow-black/20 backdrop-blur-md">
            <div className="p-4">
              
              <div className="grid gap-2">
                {categories.map((category) => {
                  return (
                    <div key={category.id} className="group">
                      {/* Categoría Principal */}
                      <Link
                        to={`/category/${category.id}`}
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left hover:bg-accent border border-transparent hover:border-border group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                          <div className="w-4 h-4 rounded-sm bg-primary"></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground group-hover:text-primary">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{category.subcategories?.length} subcategorías</div>
                        </div>
                        <MdKeyboardArrowDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </Link>
                      
                      {/* Subcategorías (se mostrarían en hover o click) */}
                      <div className="hidden group-hover:block pl-11 pb-2">
                        <div className="grid gap-1">
                          {category.subcategories?.map((sub) => (
                            <Link
                              key={sub}
                              to={`/category/${category.id}?subcategory=${encodeURIComponent(sub)}`}
                              onClick={() => setIsOpen(false)}
                              className="text-left px-3 py-1 rounded text-sm transition-colors text-muted-foreground hover:text-primary"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Ver todas las categorías */}
              <div className="mt-4 pt-4 border-t border-border">
                <button className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 bg-primary/10 text-primary hover:bg-primary/20">
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