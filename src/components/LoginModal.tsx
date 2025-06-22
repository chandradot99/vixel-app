'use client';

import { useState } from 'react';
import { X, User, Shield, Zap, Youtube } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithGoogle } = useAuth();
  const { theme, classes } = useTheme();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Theme-aware helper functions
  const getModalBackground = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-white';
    return 'bg-yellow-300';
  };

  const getCloseButtonColor = () => {
    if (theme === 'dark') return 'bg-red-600 hover:bg-red-700';
    if (theme === 'light') return 'bg-red-500 hover:bg-red-600';
    return 'bg-red-500';
  };

  const getHeaderIconBg = () => {
    if (theme === 'dark') return 'bg-blue-600';
    if (theme === 'light') return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getBenefitColors = () => {
    if (theme === 'dark') {
      return {
        card: 'bg-gray-700',
        youtube: 'bg-blue-600',
        features: 'bg-green-600',
        security: 'bg-purple-600'
      };
    }
    if (theme === 'light') {
      return {
        card: 'bg-gray-50',
        youtube: 'bg-blue-500',
        features: 'bg-green-500',
        security: 'bg-purple-500'
      };
    }
    return {
      card: 'bg-white',
      youtube: 'bg-blue-400',
      features: 'bg-green-400',
      security: 'bg-purple-400'
    };
  };

  const getLoginButtonBg = () => {
    if (theme === 'dark') return 'bg-gray-700 hover:bg-gray-600';
    if (theme === 'light') return 'bg-white hover:bg-gray-50';
    return 'bg-white';
  };

  const benefitColors = getBenefitColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative ${getModalBackground()} border-6 ${classes.border} ${classes.shadowLarge} p-8 max-w-md w-full mx-4 ${theme === 'brutal' ? 'transform rotate-1' : ''}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 ${getCloseButtonColor()} border-3 ${classes.border} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`${getHeaderIconBg()} ${classes.borderThick} ${classes.shadow} p-4 inline-block mb-6 ${theme === 'brutal' ? 'transform -rotate-2' : ''}`}>
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className={`text-3xl font-black uppercase tracking-wider ${classes.primaryText} mb-2`}>
            JOIN THE EPIC VIXEL ARMY!
          </h2>
          <p className={`text-lg font-bold ${classes.primaryText}`}>
            Sign in to unlock your personalized video experience!
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className={`flex items-center gap-4 p-3 ${benefitColors.card} border-3 ${classes.border} ${theme === 'brutal' ? 'transform -rotate-1' : ''}`}>
            <div className={`${benefitColors.youtube} ${classes.border} border-2 p-2`}>
              <Youtube className={`w-6 h-6 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
            </div>
            <div>
              <h3 className={`font-black ${classes.primaryText} uppercase`}>PERSONALIZED RECOMMENDATIONS</h3>
              <p className={`text-sm font-bold ${classes.secondaryText}`}>Get videos based on YOUR interests!</p>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-3 ${benefitColors.card} border-3 ${classes.border} ${theme === 'brutal' ? 'transform rotate-1' : ''}`}>
            <div className={`${benefitColors.features} ${classes.border} border-2 p-2`}>
              <Zap className={`w-6 h-6 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
            </div>
            <div>
              <h3 className={`font-black ${classes.primaryText} uppercase`}>EPIC FEATURES</h3>
              <p className={`text-sm font-bold ${classes.secondaryText}`}>Unlock watch history & playlists!</p>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-3 ${benefitColors.card} border-3 ${classes.border} ${theme === 'brutal' ? 'transform -rotate-1' : ''}`}>
            <div className={`${benefitColors.security} ${classes.border} border-2 p-2`}>
              <Shield className={`w-6 h-6 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
            </div>
            <div>
              <h3 className={`font-black ${classes.primaryText} uppercase`}>SECURE & PRIVATE</h3>
              <p className={`text-sm font-bold ${classes.secondaryText}`}>Your data stays safe with Google!</p>
            </div>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full ${getLoginButtonBg()} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 p-4 flex items-center justify-center gap-3 font-black text-lg uppercase tracking-wide disabled:opacity-50 ${classes.primaryText}`}
        >
          {loading ? (
            <>
              <div className={`w-6 h-6 border-3 ${classes.border} border-t-transparent rounded-full animate-spin`}></div>
              SIGNING IN...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              SIGN IN WITH GOOGLE
            </>
          )}
        </button>

        {/* Footer */}
        <p className={`text-center text-sm font-bold ${classes.primaryText} mt-6`}>
          By signing in, you agree to our EPIC terms and conditions! 💀
        </p>
      </div>
    </div>
  );
}