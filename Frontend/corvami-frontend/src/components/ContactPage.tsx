import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineClockCircle } from 'react-icons/ai';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
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
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Contáctanos
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información de Contacto */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tarjeta de Información */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Información de Contacto
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <AiOutlineMail className={`text-xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>contacto@nn.com</p>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>soporte@nn.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <AiOutlinePhone className={`text-xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Teléfono</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>+56 9 1234 5678</p>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>+56 2 2345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <AiOutlineEnvironment className={`text-xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dirección</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Av. 123<br />
                      Coquimbo, Chile
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <AiOutlineClockCircle className={`text-xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Horario</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Lun - Vie: 9:00 - 18:00<br />
                      Sábado: 10:00 - 14:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Síguenos
                </h3>
                <div className="flex gap-3">
                  <a href="#" className={`p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-green-500/20 text-gray-400 hover:text-green-400' 
                      : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600'
                  }`}>
                    <FaFacebook className="text-xl" />
                  </a>
                  <a href="#" className={`p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-green-500/20 text-gray-400 hover:text-green-400' 
                      : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600'
                  }`}>
                    <FaTwitter className="text-xl" />
                  </a>
                  <a href="#" className={`p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-green-500/20 text-gray-400 hover:text-green-400' 
                      : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600'
                  }`}>
                    <FaInstagram className="text-xl" />
                  </a>
                  <a href="#" className={`p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-green-500/20 text-gray-400 hover:text-green-400' 
                      : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600'
                  }`}>
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-8 ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Envíanos un Mensaje
              </h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
                  <p className="text-green-400 font-medium">
                    ✓ Mensaje enviado correctamente. Te responderemos pronto.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Asunto *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta">Consulta General</option>
                      <option value="soporte">Soporte Técnico</option>
                      <option value="ventas">Información de Ventas</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                    } focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none`}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                >
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
