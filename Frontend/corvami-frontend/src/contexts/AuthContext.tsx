import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as loginApi, 
  register as registerApi, 
  logout as logoutApi, 
  getProfile, 
  isAuthenticated as checkAuth,
  addBalance as addBalanceApi
} from '../api/auth';

interface User {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  rut?: string;
  balance: number;
  isRegistered: boolean;
  isActive: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  refreshProfile: () => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_GUEST_KEY = 'corvami_guest_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Verificar modo invitado
      const guestMode = localStorage.getItem(STORAGE_GUEST_KEY);
      if (guestMode === 'true') {
        setIsGuest(true);
        setLoading(false);
        return;
      }

      // Cargar perfil si hay token
      if (checkAuth()) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Error al cargar perfil:', error);
          logoutApi();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authData = await loginApi({ email, password });
      setUser(authData.user);
      setIsGuest(false);
      localStorage.removeItem(STORAGE_GUEST_KEY);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
  ) => {
    try {
      const authData = await registerApi({
        email,
        password,
        name,
        phone,
      });
      setUser({
        userId: authData.user.userId,
        email: authData.user.email,
        name: authData.user.name,
        balance: Number(authData.user.balance),
        isRegistered: true,
        isActive: true,
      });
      setIsGuest(false);
      localStorage.removeItem(STORAGE_GUEST_KEY);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem(STORAGE_GUEST_KEY);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem(STORAGE_GUEST_KEY, 'true');
    setShowAuthModal(false);
  };

  const refreshProfile = async () => {
    if (checkAuth()) {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Error al refrescar perfil:', error);
        throw error;
      }
    }
  };

  const addBalance = async (amount: number) => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    try {
      const updatedUser = await addBalanceApi(user.userId, amount);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al agregar balance:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isGuest,
        login,
        register,
        logout,
        continueAsGuest,
        refreshProfile,
        addBalance,
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
