import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AiOutlineClose, AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';

const AuthModal: React.FC = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
      <div 
        className="relative w-full max-w-sm mx-4 rounded-xl shadow-2xl overflow-hidden bg-gray-900 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-3 right-3 p-1.5 rounded-full transition-colors z-10 hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <AiOutlineClose size={18} />
        </button>

        {/* Contenido */}
        <div className="p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-1 text-white">
              {isLogin ? 'Bienvenido' : 'Crear cuenta'}
            </h2>
            <p className="text-xs text-gray-400">
              {isLogin 
                ? 'Inicia sesión o compra como invitado'
                : 'Regístrate para empezar a comprar'
              }
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Campos de registro */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">
                    Nombre completo <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">
                    Teléfono
                  </label>
                  <div className="relative">
                    <AiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+56 9 1234 5678"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Opcional</p>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">
                Correo <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">
                Contraseña <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-0.5">Mínimo 6 caracteres</p>
              )}
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-sm font-semibold rounded-lg transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-900 text-gray-500">
                o
              </span>
            </div>
          </div>

          {/* Botón invitado */}
          <button
            onClick={handleGuestClick}
            className="w-full py-2 text-sm font-medium rounded-lg transition-all bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
          >
            Continuar como invitado
          </button>

          {/* Toggle login/register */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  phone: '',
                });
              }}
              className="text-xs font-medium transition-colors text-gray-400 hover:text-emerald-400"
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