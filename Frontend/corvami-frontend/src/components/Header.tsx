import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { Wallet } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CategoriesDropdown from './CategoriesDropdown';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { cart } = useCart();
  const { user, isAuthenticated, isGuest, setShowAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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
            <Link 
              to="/"
              className="text-xl md:text-2xl font-bold text-white hover:text-green-400 transition-colors"
            >
              Corvami Store
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link 
              to="/"
              className={`hover:text-emerald-100 transition-colors font-medium ${
                location.pathname === '/' ? 'text-green-400' : 'text-white'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/products"
              className={`hover:text-emerald-100 transition-colors font-medium ${
                location.pathname === '/products' ? 'text-green-400' : 'text-white'
              }`}
            >
              Productos
            </Link>
            <CategoriesDropdown />
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
              {isAuthenticated || isGuest ? (
                <>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative text-white hover:text-green-400 transition-colors flex items-center gap-2"
                  >
                    <AiOutlineUser size={20} />
                    {isAuthenticated && user && (
                      <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg">
                        <Wallet size={14} className="text-green-400" />
                        <span className="text-xs font-semibold text-green-400">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                        </span>
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-800 py-2">
                      {isAuthenticated && user && (
                        <>
                          <div className="px-4 py-3 border-b border-gray-800">
                            <p className="text-white font-medium text-sm">{user.name}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                          <div className="px-4 py-3 border-b border-gray-800 bg-green-500/10">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Saldo disponible</span>
                              <Wallet size={14} className="text-green-400" />
                            </div>
                            <p className="text-green-400 font-bold text-lg">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                            </p>
                          </div>
                        </>
                      )}
                      {isGuest && (
                        <div className="px-4 py-2 border-b border-gray-800">
                          <p className="text-gray-400 text-xs">Modo invitado</p>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowAuthModal(true);
                            }}
                            className="mt-2 text-green-400 text-xs hover:text-green-300"
                          >
                            Crear cuenta para guardar tu info
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors text-sm"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-emerald-600 border-t border-emerald-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md"
              >
                Inicio
              </Link>
              <Link 
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md"
              >
                Productos
              </Link>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Categorías</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Ofertas</button>
              <button className="block w-full text-left px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Contacto</button>
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Auth Modal */}
      {!isAuthenticated && !isGuest && (
        <div onClick={() => setShowAuthModal(false)}>
          <AuthModal />
        </div>
      )}
    </header>
  );
};

export default Header;