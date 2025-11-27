import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import AllProductsPage from './components/AllProductsPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import ProfilePage from './components/ProfilePage';
import OffersPage from './components/OffersPage';
import ContactPage from './components/ContactPage';
import AuthModal from './components/AuthModal';

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <ProductsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}

function App() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black' 
        : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
    }`}>
      <Routes>
        {/* Rutas con Header y Footer */}
        <Route path="/" element={
          <>
            <Header />
            <HomePage />
            <Footer />
            <AuthModal />
          </>
        } />
        
        <Route path="/products" element={
          <>
            <Header />
            <AllProductsPage />
            <Footer />
            <AuthModal />
          </>
        } />
        
        <Route path="/category/:categorySlug" element={
          <>
            <Header />
            <CategoryPage />
            <Footer />
            <AuthModal />
          </>
        } />

        <Route path="/cart" element={
          <>
            <Header />
            <CartPage />
            <Footer />
          </>
        } />

        <Route path="/checkout" element={
          <>
            <Header />
            <CheckoutPage />
            <Footer />
          </>
        } />

        <Route path="/order-confirmation/:orderId" element={
          <>
            <Header />
            <OrderConfirmationPage />
            <Footer />
          </>
        } />

        <Route path="/profile" element={
          <>
            <Header />
            <ProfilePage />
            <Footer />
          </>
        } />

        <Route path="/offers" element={
          <>
            <Header />
            <OffersPage />
            <Footer />
            <AuthModal />
          </>
        } />

        <Route path="/contact" element={
          <>
            <Header />
            <ContactPage />
            <Footer />
          </>
        } />

        {/* Ruta 404 - redireccionar a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;