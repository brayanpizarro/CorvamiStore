import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  cartItems: number;
}

const Header: React.FC<HeaderProps> = ({ cartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-white">Corvami Store</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-emerald-100 transition-colors font-medium">Inicio</a>
            <a href="#" className="text-white hover:text-emerald-100 transition-colors font-medium">Productos</a>
            <a href="#" className="text-white hover:text-emerald-100 transition-colors font-medium">Categorías</a>
            <a href="#" className="text-white hover:text-emerald-100 transition-colors font-medium">Ofertas</a>
            <a href="#" className="text-white hover:text-emerald-100 transition-colors font-medium">Contacto</a>
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
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-emerald-600 border-t border-emerald-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Inicio</a>
              <a href="#" className="block px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Productos</a>
              <a href="#" className="block px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Categorías</a>
              <a href="#" className="block px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Ofertas</a>
              <a href="#" className="block px-3 py-2 text-white hover:bg-emerald-700 rounded-md">Contacto</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;