import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const TestimonialsSection: React.FC = () => {
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
    <section className="py-16 relative overflow-hidden transition-all duration-300 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse bg-primary/10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-700 bg-accent/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Lo que dicen nuestros <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">clientes</span>
          </h2>
          <p className="text-xl text-muted-foreground">Miles de clientes satisfechos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 shadow-lg group bg-card/80 border-border hover:border-primary/40 hover:bg-card/95 hover:shadow-primary/10">
              <div className="flex text-primary mb-4 group-hover:text-cyan-300 transition-colors">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <AiFillStar key={i} size={16} />
                ))}
              </div>
              <p className="mb-6 italic group-hover:text-foreground transition-colors text-muted-foreground">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary/40 group-hover:border-primary transition-colors"
                />
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors text-foreground">{testimonial.name}</h4>
                  <p className="text-sm group-hover:text-primary transition-colors text-muted-foreground">Cliente verificado</p>
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