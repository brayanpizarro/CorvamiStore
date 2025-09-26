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

function App() {
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState(0);

  const addToCart = (productId: number) => {
    setCartItems(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black' 
        : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
    }`}>
      <Header cartItems={cartItems} />
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <ProductsSection onAddToCart={addToCart} />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default App;