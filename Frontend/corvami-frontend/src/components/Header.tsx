import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X, User as UserIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CategoriesDropdown from './CategoriesDropdown';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  cartItems: number;
  onNavigateHome?: () => void;
  onNavigateToCategory?: (categorySlug: string) => void;
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ cartItems, onNavigateHome, onNavigateToCategory, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

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
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            <button className="text-white hover:text-emerald-100 transition-colors font-medium">Productos</button>
            <CategoriesDropdown onCategorySelect={onNavigateToCategory} />
            <button className="text-white hover:text-emerald-100 transition-colors font-medium">Ofertas</button>
            <button className="text-white hover:text-emerald-100 transition-colors font-medium">Contacto</button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="text-white hover:text-green-400 transition-colors">
              <Search size={20} />
            </button>
            <button className="relative text-white hover:text-green-400 transition-colors">
              <ShoppingCart size={20} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold glow-green">
                  {cartItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400"
                  >
                    <UserIcon size={20} />
                    <span className="text-sm font-medium hidden sm:inline">{user.firstName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border-2 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-800/95 border-green-500/30'
                        : 'bg-white/95 border-green-400/40'
                    }`}>
                      <div className="p-4 border-b border-green-500/30">
                        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </p>
                      </div>

                      <div className="p-2 space-y-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                            theme === 'dark'
                              ? 'text-white hover:bg-green-500/20'
                              : 'text-gray-900 hover:bg-green-500/10'
                          }`}
                        >
                          Mi Perfil
                        </Link>
                        <button className={`w-full text-left px-4 py-2 rounded transition-colors ${
                          theme === 'dark'
                            ? 'text-white hover:bg-green-500/20'
                            : 'text-gray-900 hover:bg-green-500/10'
                        }`}>
                          Mis Órdenes
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105"
                >
                  Iniciar Sesión
                </Link>
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
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Productos</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Categorías</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Ofertas</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Contacto</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;