import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineWallet } from 'react-icons/ai';
import { FaBox } from 'react-icons/fa';
import CategoriesDropdown from './CategoriesDropdown';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import AddBalanceModal from './AddBalanceModal';
import OrdersModal from './OrdersModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl shadow-lg border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`
          : `${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Botón menú móvil */}
          <button
            className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className={`text-lg sm:text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} hover:text-emerald-500 transition-colors`}
            >
              NN
            </Link>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
            <Link
              to="/"
              className={`hover:text-emerald-500 transition-colors font-medium text-sm xl:text-base ${location.pathname === '/' ? 'text-emerald-500' : isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Inicio
            </Link>
            <Link
              to="/products"
              className={`hover:text-emerald-500 transition-colors font-medium text-sm xl:text-base ${location.pathname === '/products' ? 'text-emerald-500' : isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Productos
            </Link>
            <CategoriesDropdown />
            <Link
              to="/contact"
              className={`hover:text-emerald-500 transition-colors font-medium text-sm xl:text-base ${location.pathname === '/contact' ? 'text-emerald-500' : isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Contacto
            </Link>
          </nav>

          {/* Iconos derecha */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className={`hidden sm:block ${isDark ? 'text-gray-300 hover:text-emerald-500' : 'text-gray-700 hover:text-emerald-500'}`}>
              <AiOutlineSearch size={20} />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)} 
              className={`relative ${isDark ? 'text-gray-300 hover:text-emerald-500' : 'text-gray-700 hover:text-emerald-500'}`}
            >
              <AiOutlineShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menú usuario */}
            <div className="relative">
              {isAuthenticated || isGuest ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`relative ${isDark ? 'text-gray-300 hover:text-emerald-500' : 'text-gray-700 hover:text-emerald-500'} flex items-center gap-2`}
                  >
                    <AiOutlineUser size={20} />
                    {isAuthenticated && user && (
                      <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <AiOutlineWallet size={14} className="text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-500">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                        </span>
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border py-2 z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      {isAuthenticated && user && (
                        <>
                          <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                          </div>
                          <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} bg-emerald-500/10`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saldo disponible</span>
                              <AiOutlineWallet size={14} className="text-emerald-500" />
                            </div>
                            <p className="text-emerald-500 font-bold text-lg mb-3">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowOrders(true);
                            }}
                            className={`w-full text-left px-4 py-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors text-sm flex items-center gap-2`}
                          >
                            <FaBox size={14} />
                            <span>Mis Órdenes</span>
                          </button>
                        </>
                      )}
                      {isGuest && (
                        <div className={`px-4 py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Modo invitado</p>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowAuthModal(true);
                            }}
                            className="mt-2 text-emerald-500 text-xs hover:text-emerald-400"
                          >
                            Crear cuenta para guardar tu info
                          </button>
                        </div>
                      )}
                      {isAuthenticated && (
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={`w-full text-left px-4 py-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors text-sm flex items-center gap-2`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Mi Perfil
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className={`w-full text-left px-4 py-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors text-sm flex items-center gap-2`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all transform hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className={`lg:hidden ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)} 
                className={`block w-full text-left px-3 py-2 rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Inicio
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMenuOpen(false)} 
                className={`block w-full text-left px-3 py-2 rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Productos
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)} 
                className={`block w-full text-left px-3 py-2 rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal />
      <AddBalanceModal isOpen={showAddBalance} onClose={() => setShowAddBalance(false)} />
      <OrdersModal isOpen={showOrders} onClose={() => setShowOrders(false)} />
    </header>
  );
};

export default Header;