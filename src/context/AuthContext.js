import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('ce_user') || null);
  const [token, setToken] = useState(localStorage.getItem('ce_token') || null);

  async function login(username, password) {
    const data = await authApi.login({ username, password });
    localStorage.setItem('ce_token', data.token);
    localStorage.setItem('ce_user', data.username);
    setToken(data.token);
    setUser(data.username);
  }

  async function register(username, password) {
    const data = await authApi.register({ username, password });
    localStorage.setItem('ce_token', data.token);
    localStorage.setItem('ce_user', data.username);
    setToken(data.token);
    setUser(data.username);
  }

  function logout() {
    localStorage.removeItem('ce_token');
    localStorage.removeItem('ce_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
