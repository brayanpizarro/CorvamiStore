import React from 'react';
import { IoFlashOutline } from 'react-icons/io5';
import { MdOutlineShield, MdOutlineLocalShipping, MdOutlineCreditCard } from 'react-icons/md';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: IoFlashOutline,
      title: 'Envío Rápido',
      description: 'Recibe tus productos en 24-48 horas',
    },
    {
      icon: MdOutlineShield,
      title: 'Garantía Total',
      description: '2 años de garantía en todos los productos',
    },
    {
      icon: MdOutlineLocalShipping,
      title: 'Envío Gratis',
      description: 'En compras superiores a $20.000',
    },
    {
      icon: MdOutlineCreditCard,
      title: 'Todo medio de pago',
      description: 'Paga tus compras de forma segura y fácil',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden transition-all duration-300 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl bg-primary/8"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 border-2 backdrop-blur-sm hover:scale-110 shadow-lg bg-card/80 border-border group-hover:bg-accent group-hover:shadow-primary/10">
                  <IconComponent className="text-primary" size={36} />
                </div>
                <h3 className="font-bold mb-3 text-lg group-hover:text-primary transition-colors text-foreground">{feature.title}</h3>
                <p className="text-sm group-hover:text-foreground transition-colors text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;