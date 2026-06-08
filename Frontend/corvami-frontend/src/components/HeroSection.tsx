import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

const HeroSection: React.FC = () => {
  const handleExploreCategoriesClick = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="relative pt-16 min-h-screen flex items-center overflow-hidden transition-all duration-300 bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse bg-primary/10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 bg-accent/30"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 bg-destructive/10"></div>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--primary) 55%, transparent) 1px, transparent 1px)', backgroundSize: '52px 52px' }}
        ></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-foreground">
            La mejor{' '}
            <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent neon-pulse drop-shadow-2xl" style={{ textShadow: '0 0 20px color-mix(in oklch, var(--primary) 55%, transparent)' }}>Tecnología</span>{' '}
            al mejor{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-primary bg-clip-text text-transparent neon-pulse drop-shadow-2xl" style={{ textShadow: '0 0 20px color-mix(in oklch, var(--primary) 45%, transparent)' }}>precio</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium text-muted-foreground">
            Descubre los últimos productos tecnológicos con descuentos increíbles y{' '}
            <span className="text-primary font-semibold glow-text">calidad garantizada</span>
          </p>
          <button 
            onClick={handleExploreCategoriesClick}
            className="group px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 border-border neon-button"
          >
            Explorar Categorías
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <AiOutlineArrowRight className="rotate-90 text-primary" size={24} />
      </div>
    </section>
  );
};

export default HeroSection;