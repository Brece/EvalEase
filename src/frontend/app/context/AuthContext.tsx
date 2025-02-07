import { createContext, useContext, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { isAuthenticated } from '../utils/auth';

/**
 * AuthContext provides the authentication state and methods to login and logout.
 */
const AuthContext = createContext({
  authenticated: false,
  login: () => {},
  logout: () => {},
});

/**
 * AuthProvider is a wrapper around the app that provides the authentication context.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const login = () => {
    setAuthenticated(true);
  };
  const logout = () => {
    setAuthenticated(false);
    queryClient.clear(); // Clear all cached data
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
