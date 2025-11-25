import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER_KEY = 'corvami_user';
const STORAGE_GUEST_KEY = 'corvami_guest_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Cargar usuario guardado
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Verificar modo invitado
    const guestMode = localStorage.getItem(STORAGE_GUEST_KEY);
    if (guestMode === 'true') {
      setIsGuest(true);
    }
  }, []);

  const login = async (email: string, _password: string) => {
    // TODO: Implementar llamada real a API
    // Por ahora, simulamos un login
    const mockUser: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
    };
    
    setUser(mockUser);
    setIsGuest(false);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));
    localStorage.removeItem(STORAGE_GUEST_KEY);
    setShowAuthModal(false);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_GUEST_KEY);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem(STORAGE_GUEST_KEY, 'true');
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isGuest,
        login,
        logout,
        continueAsGuest,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
