import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('utm_app_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginWithGithub = async () => {
    setIsLoading(true);
    
    // Simulate network delay for GitHub OAuth handshake
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock GitHub User Data
    const mockGithubUser: User = {
      id: 'gh_849201',
      name: 'Dev Creator',
      email: 'creator@github.com',
      avatarUrl: 'https://github.com/github.png', // Official GitHub logo as avatar
      provider: 'github'
    };

    setUser(mockGithubUser);
    localStorage.setItem('utm_app_user', JSON.stringify(mockGithubUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('utm_app_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};