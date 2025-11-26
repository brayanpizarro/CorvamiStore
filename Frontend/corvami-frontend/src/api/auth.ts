const API_URL = 'http://localhost:3000';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  balance?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    userId: string;
    email: string;
    name: string;
    balance: number;
    isRegistered: boolean;
  };
}

export interface User {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  balance: number;
  isRegistered: boolean;
}

// Guardar token en localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Obtener token de localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Eliminar token de localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Registrar usuario
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrarse');
  }

  const authData = await response.json();
  setAuthToken(authData.access_token);
  return authData;
};

// Iniciar sesión
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  const authData = await response.json();
  setAuthToken(authData.access_token);
  return authData;
};

// Obtener perfil del usuario autenticado
export const getProfile = async (): Promise<User> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      throw new Error('Sesión expirada');
    }
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener perfil');
  }

  return await response.json();
};

// Cerrar sesión
export const logout = () => {
  removeAuthToken();
};

// Agregar balance al usuario
export const addBalance = async (userId: string, amount: number): Promise<User> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/users/${userId}/add-balance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al agregar balance');
  }

  return await response.json();
};
