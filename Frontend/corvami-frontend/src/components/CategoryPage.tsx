import React from 'react';
import CategoryProducts from './CategoryProducts';

// Mapeo de categorías
const categoryMap = {
  'teclados': 'Teclados',
  'ratones': 'Ratones y Mouse',
  'audifonos': 'Audífonos y Headsets',
  'webcams': 'Cámaras Web',
  'laptops': 'Laptops',
  'monitores': 'Monitores',
  'smartphones': 'Smartphones',
  'tablets': 'Tablets',
  'componentes': 'Componentes de PC',
  'accesorios': 'Accesorios'
};

interface CategoryPageProps {
  categorySlug: string;
  onNavigateHome?: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, onNavigateHome }) => {
  const categoryTitle = categoryMap[categorySlug as keyof typeof categoryMap] || 'Productos';

  return (
    <CategoryProducts 
      category={categorySlug} 
      categoryTitle={categoryTitle}
      onNavigateHome={onNavigateHome}
    />
  );
};

export default CategoryPage;