import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import ThemeToggle from './ThemeToggle';
import CategoriesDropdown from './CategoriesDropdown';
import CartDrawer from './CartDrawer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartItems?: number;
  onNavigateHome?: () => void;
  onNavigateToCategory?: (categorySlug: string) => void;
  onNavigateToAllProducts?: () => void;
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToCategory, onNavigateToAllProducts, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { cart } = useCart();
  const { user, isAuthenticated, isGuest, setShowAuthModal, logout } = useAuth();
  
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl shadow-green-500/20 border-b border-green-500/30' : 'bg-black border-b border-green-500/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-emerald-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 
              className="text-xl md:text-2xl font-bold text-white cursor-pointer hover:text-green-400 transition-colors"
              onClick={onNavigateHome}
            >
              Corvami Store
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={onNavigateHome}
              className={`hover:text-emerald-100 transition-colors font-medium ${
                currentPage === 'home' ? 'text-green-400' : 'text-white'
              }`}
            >
              Inicio
            </button>
            <button 
              onClick={onNavigateToAllProducts}
              className={`hover:text-emerald-100 transition-colors font-medium ${
                currentPage === 'all-products' ? 'text-green-400' : 'text-white'
              }`}
            >
              Productos
            </button>
            <CategoriesDropdown onCategorySelect={onNavigateToCategory} />
            <button className="text-white hover:text-emerald-100 transition-colors font-medium">Ofertas</button>
            <button className="text-white hover:text-emerald-100 transition-colors font-medium">Contacto</button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="text-white hover:text-green-400 transition-colors">
              <AiOutlineSearch size={20} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-white hover:text-green-400 transition-colors"
            >
              <AiOutlineShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold glow-green">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (!isAuthenticated && !isGuest) {
                    setShowAuthModal(true);
                  } else {
                    setShowUserMenu(!showUserMenu);
                  }
                }}
                className="relative text-white hover:text-green-400 transition-colors"
              >
                <AiOutlineUser size={20} />
                {(isAuthenticated || isGuest) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                )}
              </button>

              {/* User Dropdown */}
              {showUserMenu && (isAuthenticated || isGuest) && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-800 py-2">
                  {isAuthenticated && user && (
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  )}
                  {isGuest && (
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-gray-400 text-xs">Modo invitado</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors text-sm"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-emerald-600 border-t border-emerald-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => {
                  onNavigateHome?.();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md"
              >
                Inicio
              </button>
              <button 
                onClick={() => {
                  onNavigateToAllProducts?.();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md"
              >
                Productos
              </button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Categorías</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Ofertas</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Contacto</button>
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;