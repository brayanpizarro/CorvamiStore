import React from 'react';
import CategoryProducts from './CategoryProducts';

// Mapeo de categorías (slug -> nombre para mostrar)
const categoryMap: Record<string, string> = {
  'teclados': 'Teclados',
  'teclado': 'Teclados',
  'ratones': 'Ratones y Mouse',
  'mouse': 'Mouse',
  'audifonos': 'Audífonos',
  'webcams': 'Webcam',
  'webcam': 'Webcam',
  'laptops': 'Laptops',
  'laptop': 'Laptops',
  'monitores': 'Monitores',
  'monitor': 'Monitores',
  'smartphones': 'Smartphones',
  'tablets': 'Tablets',
  'componentes': 'Componentes de PC',
  'accesorios': 'Accesorios'
};

// Normalizar categoría para buscar en BD (quitar plurales y acentos)
const normalizeCategoryForDB = (slug: string): string => {
  const normalized = slug.toLowerCase()
    .replace(/s$/, '') // quitar 's' final
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
  
  // Mapeo específico slug -> categoría en BD
  const dbCategoryMap: Record<string, string> = {
    'teclado': 'Teclado',
    'mouse': 'Mouse',
    'raton': 'Mouse',
    'ratone': 'Mouse',
    'audifono': 'Audífonos',
    'webcam': 'Webcam',
    'laptop': 'Laptop',
    'monitor': 'Monitor',
  };
  
  return dbCategoryMap[normalized] || normalized;
};

interface CategoryPageProps {
  categorySlug: string;
  onNavigateHome?: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, onNavigateHome }) => {
  const categoryTitle = categoryMap[categorySlug] || 'Productos';
  const normalizedCategory = normalizeCategoryForDB(categorySlug);

  return (
    <CategoryProducts 
      category={normalizedCategory} 
      categoryTitle={categoryTitle}
      onNavigateHome={onNavigateHome}
    />
  );
};

export default CategoryPage;