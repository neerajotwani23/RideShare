import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  roleSelected: boolean;
  profileSetupComplete: boolean;
  currentRole: 'driver' | 'passenger' | null;
  user: any;
  login: (userData?: any) => void;
  signup: (userData?: any) => void;
  selectRole: (role: 'driver' | 'passenger') => void;
  completeProfileSetup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to false for login flow
  const [roleSelected, setRoleSelected] = useState(true); // Set to true for easier testing
  const [profileSetupComplete, setProfileSetupComplete] = useState(true); // Set to true for easier testing
  const [currentRole, setCurrentRole] = useState<'driver' | 'passenger' | null>('driver'); // Default role for testing
  const [user, setUser] = useState(null);

  const login = (userData?: any) => {
    setIsAuthenticated(true);
    if (userData) setUser(userData);
  };

  const signup = (userData?: any) => {
    setIsAuthenticated(true);
    if (userData) setUser(userData);
  };

  const selectRole = (role: 'driver' | 'passenger') => {
    setRoleSelected(true);
    setCurrentRole(role);
  };

  const completeProfileSetup = () => {
    setProfileSetupComplete(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRoleSelected(false);
    setProfileSetupComplete(false);
    setCurrentRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      roleSelected, 
      profileSetupComplete,
      currentRole,
      user,
      login, 
      signup, 
      selectRole,
      completeProfileSetup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 