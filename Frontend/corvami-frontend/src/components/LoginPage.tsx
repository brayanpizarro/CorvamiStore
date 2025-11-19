import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-12 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-black via-gray-900 to-black'
          : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/30'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 ${
            theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-500/25'
          }`}
        ></div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Iniciar Sesión
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Bienvenido de vuelta a <span className="text-green-400 font-bold">Corvami Store</span>
          </p>
        </div>

        {/* Login Form */}
        <div
          className={`backdrop-blur-sm rounded-2xl border-2 shadow-2xl p-8 transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-green-500/30 shadow-green-500/25'
              : 'bg-white/80 border-green-400/40 shadow-green-400/30'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                }`}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-400'
                  }`}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div
              className={`flex-1 h-px ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            ></div>
            <span
              className={`px-4 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              ¿No tienes cuenta?
            </span>
            <div
              className={`flex-1 h-px ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            ></div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="w-full block text-center px-4 py-3 rounded-lg border-2 border-green-500/50 text-green-400 font-bold transition-all duration-300 hover:bg-green-500/10 hover:border-green-400"
          >
            Crear Nueva Cuenta
          </Link>
        </div>

        {/* Additional Info */}
        <div className={`mt-8 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p>¿Olvidaste tu contraseña? <span className="text-green-400 cursor-pointer hover:underline">Recuperar</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
