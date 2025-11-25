import React, { useEffect } from 'react';
import CategoryProducts from './CategoryProducts';

interface AllProductsPageProps {
  onNavigateHome?: () => void;
}

const AllProductsPage: React.FC<AllProductsPageProps> = ({ onNavigateHome }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <CategoryProducts
      category="all"
      categoryTitle="Todos los Productos"
      onNavigateHome={onNavigateHome}
    />
  );
};

export default AllProductsPage;
