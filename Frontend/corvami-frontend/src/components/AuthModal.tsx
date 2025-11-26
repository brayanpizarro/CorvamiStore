import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { AiOutlineClose, AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';

const AuthModal: React.FC = () => {
  const { theme } = useTheme();
  const { showAuthModal, setShowAuthModal, login, register, continueAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name, formData.phone);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestClick = () => {
    continueAsGuest();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'
        }`}
      >
        {/* Botón cerrar */}
        <button
          onClick={() => setShowAuthModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <AiOutlineClose size={20} />
        </button>

        {/* Contenido */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isLogin ? '¡Bienvenido de vuelta!' : 'Crear cuenta'}
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Inicia sesión para continuar o compra como invitado
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nombre *
                  </label>
                  <div className="relative">
                    <AiOutlineUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Teléfono
                  </label>
                  <div className="relative">
                    <AiOutlinePhone className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="3001234567"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email *
              </label>
              <div className="relative">
                <AiOutlineMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Contraseña *
              </label>
              <div className="relative">
                <AiOutlineLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
            }`}>
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${
                theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
              }`}>
                o
              </span>
            </div>
          </div>

          {/* Botón invitado */}
          <button
            onClick={handleGuestClick}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
            }`}
          >
            Continuar como invitado
          </button>

          {/* Toggle login/register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-green-400'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
