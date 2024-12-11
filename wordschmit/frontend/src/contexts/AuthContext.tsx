import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  checkOnboardingStatus: () => Promise<boolean>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const checkOnboardingStatus = async () => {
    if (!token || !user) return false;

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        const updatedUser = { ...user, hasCompletedOnboarding: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return false;
      }

      const data = await response.json();
      const hasCompletedOnboarding = Boolean(
        data.data?.businessDetails &&
        Object.keys(data.data.businessDetails).length > 0
      );

      const updatedUser = { ...user, hasCompletedOnboarding };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return hasCompletedOnboarding;
    } catch (err) {
      const updatedUser = { ...user, hasCompletedOnboarding: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return false;
    }
  };

  const updateProfile = async (data: any) => {
    if (!token || !user) throw new Error('Not authenticated');

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const newUser = { ...data.data.user, hasCompletedOnboarding: false };
      setToken(data.data.token);
      setUser(newUser);
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set initial user data
      const initialUser = { ...data.data.user, hasCompletedOnboarding: false };
      setToken(data.data.token);
      setUser(initialUser);
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(initialUser));

      // Check onboarding status after login
      await checkOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isLoading, 
      error,
      checkOnboardingStatus,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 