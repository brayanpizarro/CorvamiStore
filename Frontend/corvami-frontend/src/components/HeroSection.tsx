import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`relative pt-16 min-h-screen flex items-center overflow-hidden transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-white via-gray-50 to-white'
    }`}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Neon Gradient Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-green-400/30' : 'bg-green-500/40'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
          theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-600/30'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 ${
          theme === 'dark' ? 'bg-lime-400/25' : 'bg-lime-500/35'
        }`}></div>
        {/* Neon Grid Effect */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-5' : 'opacity-10'}`} style={{backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            La mejor{' '}
            <span className={`${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent neon-pulse' 
                : 'text-green-600 font-black'
            } drop-shadow-2xl`} style={{textShadow: theme === 'dark' ? '0 0 30px #10b981' : '0 0 15px #059669'}}>Tecnología</span>{' '}
            al mejor{' '}
            <span className={`${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent neon-pulse' 
                : 'text-green-700 font-black'
            } drop-shadow-2xl`} style={{textShadow: theme === 'dark' ? '0 0 30px #84cc16' : '0 0 15px #15803d'}}>precio</span>
          </h2>
          <p className={`text-lg sm:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Descubre los últimos productos tecnológicos con descuentos increíbles y{' '}
            <span className="text-green-400 font-semibold glow-text">calidad garantizada</span>
          </p>
          <button className={`group px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-green-500/50 hover:shadow-green-400/70 border-green-400/50 hover:border-green-300 neon-button'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-600/40 hover:shadow-green-700/50 border-green-500/60 hover:border-green-600'
          }`}>
            Explorar Categorías
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className={`rotate-90 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} size={24} />
      </div>
    </section>
  );
};

export default HeroSection;