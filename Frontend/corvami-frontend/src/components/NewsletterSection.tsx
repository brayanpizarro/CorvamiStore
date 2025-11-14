import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const NewsletterSection: React.FC = () => {
  const { theme } = useTheme();
  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900' : 'bg-gradient-to-r from-gray-100 via-white to-gray-100'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/30'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000 ${
          theme === 'dark' ? 'bg-emerald-500/25' : 'bg-emerald-500/35'
        }`}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          ¡No te pierdas las mejores{' '}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">tecnologías</span>!
        </h2>
        <p className={`text-xl mb-8 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>Suscríbete y entérate de todo lo nuevo!</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Tu email aquí..."
            className={`flex-1 px-6 py-4 rounded-lg backdrop-blur-sm border-2 focus:outline-none transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-green-500/30 focus:border-green-400 text-white placeholder-gray-400'
                : 'bg-white/80 border-green-400/40 focus:border-green-500 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-8 py-4 rounded-lg font-bold transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-green-500/50 transform hover:scale-105">
            Suscribirse
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;