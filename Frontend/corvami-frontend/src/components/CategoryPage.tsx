import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  // Primero, limpiar acentos
  let normalized = slug.toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
  
  // Mapeo específico slug -> categoría en BD
  const dbCategoryMap: Record<string, string> = {
    'teclado': 'Teclado',
    'teclados': 'Teclado',
    'mouse': 'Mouse',
    'raton': 'Mouse',
    'ratones': 'Mouse',
    'audifono': 'Audífonos',
    'audifonos': 'Audífonos',
    'webcam': 'Webcam',
    'webcams': 'Webcam',
    'laptop': 'Laptop',
    'laptops': 'Laptop',
    'monitor': 'Monitor',
    'monitores': 'Monitor',
    'smartphone': 'Smartphone',
    'smartphones': 'Smartphone',
    'tablet': 'Tablet',
    'tablets': 'Tablet',
    'componente': 'Componentes PC',
    'componentes': 'Componentes PC',
  };
  
  return dbCategoryMap[normalized] || normalized;
};

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get('subcategory');
  
  if (!categorySlug) {
    return <div>Categoría no encontrada</div>;
  }

  const categoryTitle = categoryMap[categorySlug] || 'Productos';
  const normalizedCategory = normalizeCategoryForDB(categorySlug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categorySlug, subcategory]);

  return (
    <CategoryProducts 
      category={normalizedCategory} 
      categoryTitle={categoryTitle}
      subcategory={subcategory || undefined}
    />
  );
};

export default CategoryPage;