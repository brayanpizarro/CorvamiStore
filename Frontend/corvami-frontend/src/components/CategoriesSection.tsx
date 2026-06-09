import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import { MdOutlineKeyboard, MdHeadphones, MdOutlineVideocam } from 'react-icons/md';
import { BsMouse } from 'react-icons/bs';
import { productApi } from '../api/products';

const CategoriesSection: React.FC = () => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const categories = [
    { name: "Laptops", icon: HiOutlineDesktopComputer, slug: "laptop" },
    { name: "Teclados", icon: MdOutlineKeyboard, slug: "teclado" },
    { name: "Ratones", icon: BsMouse, slug: "mouse" },
    { name: "Monitores", icon: HiOutlineDesktopComputer, slug: "monitor" },
    { name: "Audífonos", icon: MdHeadphones, slug: "audifonos" },
    { name: "Webcams", icon: MdOutlineVideocam, slug: "webcam" }
  ];

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      const products = await productApi.getAll();
      const counts: Record<string, number> = {};
      
      // Normalizar categorías para comparación
      const normalizeCategory = (cat: string) => {
        return cat.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();
      };

      // Contar productos por categoría
      products.forEach(product => {
        const normalized = normalizeCategory(product.category);
        counts[normalized] = (counts[normalized] || 0) + 1;
      });

      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error cargando conteos de categorías:', error);
    }
  };

  const getCategoryCount = (slug: string) => {
    const normalized = slug.toLowerCase();
    return categoryCounts[normalized] || 0;
  };

  return (
    <section id="categories-section" className="py-16 relative overflow-hidden transition-all duration-300 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse bg-primary/8"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 bg-accent/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Explora por <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Categorías</span>
          </h2>
          <p className="text-xl text-muted-foreground">Encuentra exactamente lo que necesitas</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/category/${category.slug}`}
                className="backdrop-blur-sm rounded-xl p-6 text-center border-2 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group shadow-lg bg-card/80 border-border hover:border-primary/40 hover:bg-card/95 hover:shadow-primary/10"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    <IconComponent className="text-primary" size={48} />
                </div>
              <h3 className="font-bold mb-1 group-hover:text-primary transition-colors text-foreground">{category.name}</h3>
              <p className="text-sm group-hover:text-foreground transition-colors text-muted-foreground">{getCategoryCount(category.slug)} {getCategoryCount(category.slug) === 1 ? 'producto' : 'productos'}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;