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

const Header: React.FC = () => {
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
        isScrolled ? 'bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-border/80' : 'bg-background border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>

          <div className="flex-shrink-0">
            <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors">
              NN
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
            <Link
              to="/"
              className={`hover:text-primary transition-colors font-medium text-sm xl:text-base ${location.pathname === '/' ? 'text-primary' : 'text-foreground'}`}
            >
              Inicio
            </Link>
            <Link
              to="/products"
              className={`hover:text-primary transition-colors font-medium text-sm xl:text-base ${location.pathname === '/products' ? 'text-primary' : 'text-foreground'}`}
            >
              Productos
            </Link>
            <CategoriesDropdown />
            <Link
              to="/offers"
              className={`hover:text-primary transition-colors font-medium text-sm xl:text-base ${location.pathname === '/offers' ? 'text-primary' : 'text-foreground'}`}
            >
              Ofertas
            </Link>
            <Link
              to="/contact"
              className={`hover:text-primary transition-colors font-medium text-sm xl:text-base ${location.pathname === '/contact' ? 'text-primary' : 'text-foreground'}`}
            >
              Contacto
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-foreground hover:text-primary transition-colors hidden sm:block">
              <AiOutlineSearch size={20} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative text-foreground hover:text-primary transition-colors">
              <AiOutlineShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold glow-green">
                  {itemCount}
                </span>
              )}
            </button>

            <div className="relative">
              {isAuthenticated || isGuest ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <AiOutlineUser size={20} />
                    {isAuthenticated && user && (
                      <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg border border-border">
                        <AiOutlineWallet size={14} className="text-primary" />
                        <span className="text-xs font-semibold text-primary">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                        </span>
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-card/95 rounded-lg shadow-xl border border-border py-2 backdrop-blur-xl">
                      {isAuthenticated && user && (
                        <>
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-foreground font-medium text-sm">{user.name}</p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                          </div>
                          <div className="px-4 py-3 border-b border-border bg-primary/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-muted-foreground text-xs">Saldo disponible</span>
                              <AiOutlineWallet size={14} className="text-primary" />
                            </div>
                            <p className="text-primary font-bold text-lg mb-3">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
                            </p>
                            <button
                              onClick={() => {
                                setShowUserMenu(false);
                                setShowAddBalance(true);
                              }}
                              className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <AiOutlineWallet size={16} />
                              Agregar Saldo
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowOrders(true);
                            }}
                            className="w-full text-left px-4 py-2 text-foreground hover:bg-accent transition-colors text-sm flex items-center gap-2"
                          >
                            <FaBox size={14} />
                            <span>Mis Órdenes</span>
                          </button>
                        </>
                      )}
                      {isGuest && (
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-muted-foreground text-xs">Modo invitado</p>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowAuthModal(true);
                            }}
                            className="mt-2 text-primary text-xs hover:text-primary/80"
                          >
                            Crear cuenta para guardar tu info
                          </button>
                        </div>
                      )}
                      {isAuthenticated && (
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-4 py-2 text-foreground hover:bg-accent transition-colors text-sm flex items-center gap-2"
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
                        className="w-full text-left px-4 py-2 text-foreground hover:bg-accent transition-colors text-sm flex items-center gap-2"
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
                  className="neon-button px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded-md">
                Inicio
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded-md">
                Productos
              </Link>
              <button className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded-md">Categorías</button>
              <Link to="/offers" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded-md">
                Ofertas
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded-md">
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {!isAuthenticated && !isGuest && (
        <div onClick={() => setShowAuthModal(false)}>
          <AuthModal />
        </div>
      )}

      <AddBalanceModal isOpen={showAddBalance} onClose={() => setShowAddBalance(false)} />

      <OrdersModal isOpen={showOrders} onClose={() => setShowOrders(false)} />
    </header>
  );
};

export default Header;