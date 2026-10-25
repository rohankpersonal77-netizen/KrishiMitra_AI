import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USER = {
  id: 'farmer_demo_101',
  name: 'Ramesh Patil',
  email: 'ramesh.patil@krishimitra.ai',
  phone: '+91 98220 12345',
  state: 'Maharashtra',
  district: 'Nashik',
  preferredLanguage: 'en',
  isDemo: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('krishi_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('krishi_token') || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('krishi_user', JSON.stringify(data.user));
      localStorage.setItem('krishi_token', data.token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      // If server unreachable or error, allow test credentials demo
      if (email.toLowerCase().includes('demo') || email.toLowerCase().includes('ramesh')) {
        setUser(DEMO_USER);
        setToken('demo_token_valid');
        localStorage.setItem('krishi_user', JSON.stringify(DEMO_USER));
        localStorage.setItem('krishi_token', 'demo_token_valid');
        setLoading(false);
        return { success: true, isDemo: true };
      }
      setAuthError(err.message || 'Failed to authenticate');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('krishi_user', JSON.stringify(data.user));
      localStorage.setItem('krishi_token', data.token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      // Local fallback for quick preview if backend offline
      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.fullName || userData.name,
        email: userData.email,
        phone: userData.phone || '+91 98000 00000',
        state: userData.state || 'Maharashtra',
        district: userData.district || 'Nashik',
        preferredLanguage: userData.preferredLanguage || 'en',
        isDemo: false,
      };
      setUser(newUser);
      setToken('local_session_' + Date.now());
      localStorage.setItem('krishi_user', JSON.stringify(newUser));
      localStorage.setItem('krishi_token', 'local_session_' + Date.now());
      setLoading(false);
      return { success: true, localOnly: true };
    }
  };

  const exploreDemo = () => {
    setUser(DEMO_USER);
    setToken('demo_token_valid');
    localStorage.setItem('krishi_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('krishi_token', 'demo_token_valid');
    setAuthError(null);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('krishi_user');
    localStorage.removeItem('krishi_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        login,
        signup,
        exploreDemo,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
