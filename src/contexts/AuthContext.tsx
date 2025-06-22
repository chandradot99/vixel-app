'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Google Auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load Google Identity Services
        await loadGoogleScript();
        
        // Check if user is already logged in
        const savedUser = localStorage.getItem('vixel_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      if (!window.google) {
        throw new Error('Google script not loaded');
      }

      // Initialize Google OAuth
      window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
        callback: async (response: any) => {
          if (response.access_token) {
            // Get user info from Google
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            });

            if (userInfo.ok) {
              const userData = await userInfo.json();
              
              const user: User = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                avatar: userData.picture,
                accessToken: response.access_token,
              };

              setUser(user);
              localStorage.setItem('vixel_user', JSON.stringify(user));
            }
          }
        },
      }).requestAccessToken();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('vixel_user');
    
    // Revoke Google token if available
    if (user?.accessToken && window.google) {
      window.google.accounts.oauth2.revoke(user.accessToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};