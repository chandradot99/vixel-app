'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  accessToken: string;
}

// Google API Types
interface GoogleOAuth2Response {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface GoogleTokenClient {
  requestAccessToken(): void;
}

interface GoogleOAuth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleOAuth2Response) => void;
  }): GoogleTokenClient;
  revoke(accessToken: string, callback?: () => void): void;
}

interface GoogleAccounts {
  oauth2: GoogleOAuth2;
}

// Extend Window interface for Google APIs
declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

// Auth Context Type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Storage key constant
const STORAGE_KEY = 'vixel_user';

// Google OAuth2 API endpoint
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo';

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Google Auth
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        // Load Google Identity Services
        await loadGoogleScript();
        
        // Check if user is already logged in
        const savedUser = getSavedUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load Google Script
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

  // Get saved user from localStorage
  const getSavedUser = (): User | null => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        // Validate that the parsed object has all required User properties
        if (isValidUser(parsedUser)) {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  };

  // Type guard to validate User object
  const isValidUser = (obj: unknown): obj is User => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof (obj as User).id === 'string' &&
      typeof (obj as User).name === 'string' &&
      typeof (obj as User).email === 'string' &&
      typeof (obj as User).avatar === 'string' &&
      typeof (obj as User).accessToken === 'string'
    );
  };

  // Save user to localStorage
  const saveUser = (userData: User): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Fetch user info from Google API
  const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
    const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json() as GoogleUserInfo;
    return userData;
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      if (!window.google) {
        throw new Error('Google script not loaded');
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }

      // Initialize Google OAuth
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
        callback: async (response: GoogleOAuth2Response): Promise<void> => {
          try {
            if (response.access_token) {
              // Get user info from Google
              const userData = await fetchGoogleUserInfo(response.access_token);
              
              const user: User = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                avatar: userData.picture,
                accessToken: response.access_token,
              };

              setUser(user);
              saveUser(user);
            } else {
              throw new Error('No access token received from Google');
            }
          } catch (error) {
            console.error('Error processing Google auth response:', error);
            throw error;
          }
        },
      });

      tokenClient.requestAccessToken();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = (): void => {
    try {
      // Revoke Google token if available
      if (user?.accessToken && window.google) {
        window.google.accounts.oauth2.revoke(user.accessToken, () => {
          console.log('Google token revoked successfully');
        });
      }

      // Clear user state and storage
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear local state even if revocation fails
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};