import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const NewsletterSection: React.FC = () => {
  const { theme } = useTheme();
  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-r from-[#05070b] via-[#0b1117] to-[#05070b]' : 'bg-gradient-to-r from-gray-100 via-white to-gray-100'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-500/20'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000 ${
          theme === 'dark' ? 'bg-teal-500/8' : 'bg-teal-500/18'
        }`}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
        }`}>
          ¡No te pierdas las mejores{' '}
          <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">tecnologías</span>!
        </h2>
        <p className={`text-xl mb-8 ${
          theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
        }`}>Suscríbete y entérate de todo lo nuevo!</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Tu email aquí..."
            className={`flex-1 px-6 py-4 rounded-lg backdrop-blur-sm border-2 focus:outline-none transition-colors ${
              theme === 'dark'
                ? 'bg-slate-900/70 border-slate-700 focus:border-emerald-400 text-white placeholder-slate-400'
                : 'bg-white/80 border-emerald-400/30 focus:border-emerald-500 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-8 py-4 rounded-lg font-bold transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105">
            Suscribirse
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;