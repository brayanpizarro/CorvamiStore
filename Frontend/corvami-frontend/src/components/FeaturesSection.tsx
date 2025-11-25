import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { IoFlashOutline } from 'react-icons/io5';
import { MdOutlineShield, MdOutlineLocalShipping, MdOutlineCreditCard } from 'react-icons/md';

const FeaturesSection: React.FC = () => {
  const { theme } = useTheme();
  const features = [
    {
      icon: IoFlashOutline,
      title: "Envío Rápido",
      description: "Recibe tus productos en 24-48 horas",
      bgColor: "bg-gray-800/50",
      hoverColor: "group-hover:bg-gray-700/70",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30"
    },
    {
      icon: MdOutlineShield,
      title: "Garantía Total",
      description: "2 años de garantía en todos los productos",
      bgColor: "bg-gray-800/50",
      hoverColor: "group-hover:bg-gray-700/70",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/30"
    },
    {
      icon: MdOutlineLocalShipping,
      title: "Envío Gratis",
      description: "En compras superiores a $20.000",
      bgColor: "bg-gray-800/50",
      hoverColor: "group-hover:bg-gray-700/70",
      iconColor: "text-lime-400",
      borderColor: "border-lime-500/30"
    },
    {
      icon: MdOutlineCreditCard,
      title: "Todo medio de pago",
      description: "Paga tus compras de forma segura y fácil",
      bgColor: "bg-gray-800/50",
      hoverColor: "group-hover:bg-gray-700/70",
      iconColor: "text-green-300",
      borderColor: "border-green-500/30"
    }
  ];

  return (
    <section className={`py-16 relative overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      {/* Background Effects */}
      <div className={`absolute inset-0 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900/50 to-black' : 'bg-gradient-to-b from-white via-gray-50/50 to-white'
      }`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
        theme === 'dark' ? 'bg-green-500/10' : 'bg-green-500/20'
      }`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 border-2 backdrop-blur-sm hover:scale-110 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-green-500/30 hover:bg-gray-700/70 hover:shadow-green-500/20'
                    : 'bg-white/80 border-green-400/40 hover:bg-white/90 hover:shadow-green-400/25'
                }`}>
                  <IconComponent className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} size={36} />
                </div>
                <h3 className={`font-bold mb-3 text-lg group-hover:text-green-300 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`text-sm group-hover:text-green-400 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600'
                }`}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;