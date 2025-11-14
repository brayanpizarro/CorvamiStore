import React, { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CategoriesSection from './components/CategoriesSection';
import ProductsSection from './components/ProductsSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';

type CurrentPage = 'home' | 'category';

function App() {
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState(0);
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const addToCart = () => {
    setCartItems(prev => prev + 1);
  };

  const navigateToCategory = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage('category');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedCategory('');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'category':
        return <CategoryPage categorySlug={selectedCategory} onNavigateHome={navigateToHome} />;
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <FeaturesSection />
            <CategoriesSection onCategoryClick={navigateToCategory} />
            <ProductsSection onAddToCart={addToCart} />
            <TestimonialsSection />
            <NewsletterSection />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black' 
        : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
    }`}>
      <Header 
        cartItems={cartItems} 
        onNavigateHome={navigateToHome}
        onNavigateToCategory={navigateToCategory}
        currentPage={currentPage}
      />
      {renderCurrentPage()}
      <Footer />
    </div>
  );
}

export default App;