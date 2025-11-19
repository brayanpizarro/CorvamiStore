import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    } else {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user, token, navigate]);

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword('');
      setError('');
      setSuccess('');
      setIsEditing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const updateData: any = {};
      
      if (firstName !== user?.firstName) updateData.firstName = firstName;
      if (lastName !== user?.lastName) updateData.lastName = lastName;
      if (email !== user?.email) updateData.email = email;
      if (password) updateData.password = password;

      // Si no hay cambios, no hacer la petición
      if (Object.keys(updateData).length === 0) {
        setSuccess('No hay cambios para guardar');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const data = await response.json();

      // Actualizar token y usuario en localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }));

      setSuccess('Perfil actualizado correctamente');
      setPassword('');
      setIsEditing(false);

      // Recargar la página para actualizar el contexto
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back button and Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'text-green-400 hover:bg-green-500/10'
                : 'text-green-600 hover:bg-green-500/10'
            }`}
          >
            ← Volver
          </Link>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Mi Perfil
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Gestiona tu información personal
          </p>
        </div>

        {/* Profile Card */}
        <div
          className={`backdrop-blur-sm rounded-2xl border-2 shadow-2xl p-8 transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-green-500/30 shadow-green-500/25'
              : 'bg-white/80 border-green-400/40 shadow-green-400/30'
          }`}
        >
          {/* User Info Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700/50">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-black'
                    : 'bg-gradient-to-br from-green-400 to-emerald-400 text-white'
                }`}
              >
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user.firstName} {user.lastName}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
              >
                Editar
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                  isEditing
                    ? theme === 'dark'
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                    : theme === 'dark'
                    ? 'bg-gray-900/30 border-gray-800 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
                }`}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                  isEditing
                    ? theme === 'dark'
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                    : theme === 'dark'
                    ? 'bg-gray-900/30 border-gray-800 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
                }`}
                required
              />
            </div>

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
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                  isEditing
                    ? theme === 'dark'
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                    : theme === 'dark'
                    ? 'bg-gray-900/30 border-gray-800 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
                }`}
                required
              />
            </div>

            {/* Password - Solo en modo edición */}
            {isEditing && (
              <div>
                <label
                  className={`block text-sm font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Nueva Contraseña <span className="text-gray-500 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar en blanco para no cambiar"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400/50'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20'
                    }`}
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
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400">
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all duration-300 disabled:opacity-50 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-700/50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
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
              Opciones de cuenta
            </span>
            <div
              className={`flex-1 h-px ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            ></div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full px-4 py-3 rounded-lg border-2 border-red-500/50 text-red-400 font-bold transition-all duration-300 hover:bg-red-500/10 hover:border-red-400"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
