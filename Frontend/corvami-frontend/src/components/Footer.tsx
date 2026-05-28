import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`py-12 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' 
                ? 'text-green-400' 
                : 'text-gray-800'
            }`}>
              NN
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' 
                ? 'text-gray-300' 
                : 'text-gray-600'
            }`}>
              Tu tienda de confianza para productos tecnológicos de última generación. Calidad garantizada y precios imperdibles.
            </p>
            <div className="flex space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-green-500/20 hover:border-green-400 border border-transparent hover:glow-green'
                  : 'bg-gray-200 hover:bg-gray-300 border border-gray-300'
              }`}>
                < svg className={`w-5 h-5 ${
                  theme === 'dark' 
                    ? 'text-green-400' 
                    : 'text-gray-600'
                }`}
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 640 640"
                >
                 <path d="M523.4 215.7C523.7 220.2 523.7 224.8 523.7 229.3C523.7 368 418.1 527.9 225.1 527.9C165.6 527.9 110.4 510.7 64 480.8C72.4 481.8 80.6 482.1 89.3 482.1C138.4 482.1 183.5 465.5 219.6 437.3C173.5 436.3 134.8 406.1 121.5 364.5C128 365.5 134.5 366.1 141.3 366.1C150.7 366.1 160.1 364.8 168.9 362.5C120.8 352.8 84.8 310.5 84.8 259.5L84.8 258.2C98.8 266 115 270.9 132.2 271.5C103.9 252.7 85.4 220.5 85.4 184.1C85.4 164.6 90.6 146.7 99.7 131.1C151.4 194.8 229 236.4 316.1 240.9C314.5 233.1 313.5 225 313.5 216.9C313.5 159.1 360.3 112 418.4 112C448.6 112 475.9 124.7 495.1 145.1C518.8 140.6 541.6 131.8 561.7 119.8C553.9 144.2 537.3 164.6 515.6 177.6C536.7 175.3 557.2 169.5 576 161.4C561.7 182.2 543.8 200.7 523.4 215.7z"/>
              </svg>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-green-500/20 hover:border-green-400 border border-transparent hover:glow-green'
                  : 'bg-gray-200 hover:bg-gray-300 border border-gray-300'
              }`}>
                <svg 
                  className={`w-5 h-5 ${
                    theme === 'dark' 
                      ? 'text-green-400' 
                      : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 640 640"
                >
                  <path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z"/>
                </svg>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-green-500/20 hover:border-green-400 border border-transparent hover:glow-green'
                  : 'bg-gray-200 hover:bg-gray-300 border border-gray-300'
              }`}>
                <svg className={`w-5 h-5 ${
                  theme === 'dark' 
                    ? 'text-green-400' 
                    : 'text-gray-600'
                }`}
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  >
                    <path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"/>
                  </svg>
              </div>
            </div>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 ${
              theme === 'dark' 
                ? 'text-green-400' 
                : 'text-gray-800'
            }`}>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Productos
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Ofertas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 ${
              theme === 'dark' 
                ? 'text-green-400' 
                : 'text-gray-800'
            }`}>
              Soporte
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Garantías
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Devoluciones
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-green-400 hover:glow-green'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={`mt-8 pt-8 text-center border-t ${
          theme === 'dark'
            ? 'border-green-500/30 text-gray-400'
            : 'border-gray-300 text-gray-500'
        }`}>
          <p>&copy; 2025 NN. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;