import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-xl transition-all duration-300 neon-border hover:glow-green transform hover:scale-105 ${
        theme === 'dark' 
          ? 'bg-black/80 text-green-400 border-green-400/50 hover:bg-black/60' 
          : 'bg-white/90 text-green-600 border-green-500/50 hover:bg-white/70'
      }`}
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-2">
        {theme === 'dark' ? (
          <>
            <span className="text-sm font-semibold glow-text">Tema claro</span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold glow-text">Tema oscuro</span>
            </>
          )}
      </div>
    </button>
  );
};

export default ThemeToggle;