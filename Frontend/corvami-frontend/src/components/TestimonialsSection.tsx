import React from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const TestimonialsSection: React.FC = () => {
  const { theme } = useTheme();
  const testimonials = [
    {
      name: "Carlos Mendoza",
      text: "Excelente calidad y precios increíbles. Mi laptop gaming llegó perfecta y funciona de maravilla.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Ana Rodriguez",
      text: "El mejor servicio al cliente que he experimentado. Resolvieron todas mis dudas antes de comprar.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Luis García",
      text: "Envío súper rápido y productos de calidad premium. Ya es mi tienda tech favorita.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/30'
        }`}></div>
        <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-700 ${
          theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-500/25'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Lo que dicen nuestros <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">clientes</span>
          </h2>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Miles de clientes satisfechos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 shadow-lg group ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-green-500/30 hover:border-green-400/50 hover:bg-gray-700/60 hover:shadow-green-500/20'
                : 'bg-white/80 border-green-400/40 hover:border-green-500/60 hover:bg-white/90 hover:shadow-green-400/25'
            }`}>
              <div className="flex text-green-400 mb-4 group-hover:text-green-300 transition-colors">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className={`mb-6 italic group-hover:text-green-300 transition-colors ${
                theme === 'dark' ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-700'
              }`}>"{testimonial.text}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-500/50 group-hover:border-green-400 transition-colors"
                />
                <div>
                  <h4 className={`font-bold group-hover:text-green-300 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{testimonial.name}</h4>
                  <p className={`text-sm group-hover:text-green-400 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Cliente verificado ✓</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;