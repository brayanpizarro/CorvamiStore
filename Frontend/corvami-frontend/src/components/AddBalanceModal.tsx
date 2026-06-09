import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {WalletCards, Plus, X } from 'lucide-react';

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
      theme === 'dark' ? 'bg-black/80' : 'bg-slate-900/50'
    } backdrop-blur-sm`}>
      <div className={`max-w-md w-full rounded-2xl p-6 ${
        theme === 'dark' ? 'bg-slate-900 border-2 border-emerald-500/30' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/15">
              <WalletCards className="text-emerald-300" size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Agregar Saldo
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Recarga tu cuenta para comprar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Plus className="text-black" size={32} />
              </div>
            </div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              ¡Saldo Agregado!
            </h3>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Tu nuevo saldo: {formatPrice(user?.balance || 0)}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Saldo actual */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
            }`}>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Saldo actual
              </p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
              }`}>
                {formatPrice(user?.balance || 0)}
              </p>
            </div>

            {/* Montos rápidos */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
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
                        ? 'bg-emerald-400 text-slate-950'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
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
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Monto personalizado
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
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
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-400'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:outline-none transition-colors`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Botón de agregar */}
            <button
              type="submit"
              disabled={loading || !amount}
              className={`w-full py-4 rounded-lg font-bold transition-all ${
                loading || !amount
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300'
              } text-slate-950`}
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
