import React from 'react';
import CategoryProducts from './CategoryProducts';

interface AllProductsPageProps {
  onNavigateHome?: () => void;
}

const AllProductsPage: React.FC<AllProductsPageProps> = ({ onNavigateHome }) => {
  return (
    <CategoryProducts
      category="all"
      categoryTitle="Todos los Productos"
      onNavigateHome={onNavigateHome}
    />
  );
};

export default AllProductsPage;
