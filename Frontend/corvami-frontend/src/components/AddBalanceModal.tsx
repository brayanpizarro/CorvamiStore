import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Plus, X } from 'lucide-react';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { user, addBalance, refreshProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const numAmount = parseInt(amount);
      if (numAmount <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      await addBalance(numAmount);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setAmount('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar saldo');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/50'
    } backdrop-blur-sm`}>
      <div className={`max-w-md w-full rounded-2xl p-6 ${
        theme === 'dark' ? 'bg-gray-900 border-2 border-green-500/50' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Wallet className="text-green-500" size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Agregar Saldo
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Recarga tu cuenta para comprar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Plus className="text-black" size={32} />
              </div>
            </div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ¡Saldo Agregado!
            </h3>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tu nuevo saldo: {formatPrice(user?.balance || 0)}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Saldo actual */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Saldo actual
              </p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatPrice(user?.balance || 0)}
              </p>
            </div>

            {/* Montos rápidos */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Montos sugeridos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      amount === quickAmount.toString()
                        ? 'bg-green-500 text-black'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {formatPrice(quickAmount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Monto personalizado */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Monto personalizado
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                  required
                  className={`w-full pl-8 pr-4 py-3 rounded-lg border-2 text-lg font-semibold ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none transition-colors`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Botón de agregar */}
            <button
              type="submit"
              disabled={loading || !amount}
              className={`w-full py-4 rounded-lg font-bold transition-all ${
                loading || !amount
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
              } text-black`}
            >
              {loading ? 'Procesando...' : `Agregar ${amount ? formatPrice(parseInt(amount)) : 'Saldo'}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBalanceModal;
