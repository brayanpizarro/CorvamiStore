import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineClockCircle } from 'react-icons/ai';
import { FaPaperPlane } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} pt-16`}>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Información de Contacto */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <AiOutlineMail className={`text-base ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Información de Contacto
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} group-hover:bg-emerald-500/20 transition-colors`}>
                    <AiOutlineMail className={`text-sm ${isDark ? 'text-gray-400 group-hover:text-emerald-400' : 'text-gray-600 group-hover:text-emerald-600'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Email</p>
                    <p className={`text-sm break-all ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-emerald-500 transition-colors`}>
                      contacto@nn.com
                    </p>
                    <p className={`text-xs break-all ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      soporte@nn.com
                    </p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} group-hover:bg-emerald-500/20 transition-colors`}>
                    <AiOutlinePhone className={`text-sm ${isDark ? 'text-gray-400 group-hover:text-emerald-400' : 'text-gray-600 group-hover:text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Teléfono</p>
                    <p className={`text-sm ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'} transition-colors`}>
                      +56 9 1234 5678
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      +56 2 2345 6789
                    </p>
                  </div>
                </div>

                {/* Dirección */}
                <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} group-hover:bg-emerald-500/20 transition-colors`}>
                    <AiOutlineEnvironment className={`text-sm ${isDark ? 'text-gray-400 group-hover:text-emerald-400' : 'text-gray-600 group-hover:text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Dirección</p>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Av. 123, Coquimbo<br />
                      Chile
                    </p>
                  </div>
                </div>

                {/* Horario */}
                <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} group-hover:bg-emerald-500/20 transition-colors`}>
                    <AiOutlineClockCircle className={`text-sm ${isDark ? 'text-gray-400 group-hover:text-emerald-400' : 'text-gray-600 group-hover:text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Horario de atención</p>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Lun - Vie: 9:00 - 18:00<br />
                      Sábado: 10:00 - 14:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> 

          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <FaPaperPlane className={`text-base ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Envíanos un Mensaje
                </h2>
              </div>

              {submitted && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 animate-pulse">
                  <p className="text-emerald-400 font-medium text-sm text-center">
                    ¡Mensaje enviado correctamente! Te responderemos pronto.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nombre Completo <span className="text-emerald-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      } focus:outline-none`}
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className={`block mb-1.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email <span className="text-emerald-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      } focus:outline-none`}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      } focus:outline-none`}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div>
                    <label className={`block mb-1.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Asunto <span className="text-emerald-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      } focus:outline-none`}
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta"> Consulta General</option>
                      <option value="soporte"> Soporte Técnico</option>
                      <option value="ventas"> Información de Ventas</option>
                      <option value="reclamo"> Reclamo</option>
                      <option value="sugerencia"> Sugerencia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block mb-1.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mensaje <span className="text-emerald-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    } focus:outline-none resize-none`}
                    placeholder="¿En qué podemos ayudarte? Cuéntanos tu consulta..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FaPaperPlane size={14} />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div> 
        </div>
      </div> 
    </div> 
  );
};

export default ContactPage;