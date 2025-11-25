import React, { useEffect } from 'react';
import CategoryProducts from './CategoryProducts';

const AllProductsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <CategoryProducts
      category="all"
      categoryTitle="Todos los Productos"
    />
  );
};

export default AllProductsPage;
