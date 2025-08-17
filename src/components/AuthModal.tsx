import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signUp, signIn } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setError(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setError(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = mode === 'signup' 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (mode === 'signup') {
          setError('Check your email for the confirmation link!');
        } else {
          handleClose();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white w-full max-w-md mx-auto flex flex-col border border-gray-200 dark:border-[#3a3a3c] transition-all duration-300 ease-out transform shadow-2xl rounded-sm ${
          isVisible
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#3a3a3c]">
          <div className="flex items-center gap-3">
            <img
              src="/Slane.png"
              alt="Slane"
              className="w-6 h-6 rounded-sm shadow-sm"
            />
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {mode === 'signin' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">
                {mode === 'signin' ? 'Sign in to your account' : 'Get started with Slane'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 dark:text-[#a1a1a6] hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] h-9 w-9 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-gray-900 dark:text-white">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6d6d70]" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10 w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all bg-gray-50 dark:bg-[#1c1c1e] focus:bg-white dark:focus:bg-[#2c2c2e] placeholder-gray-400 dark:placeholder-[#6d6d70]"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6d6d70]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 pr-10 w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all bg-gray-50 dark:bg-[#1c1c1e] focus:bg-white dark:focus:bg-[#2c2c2e] placeholder-gray-400 dark:placeholder-[#6d6d70]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#6d6d70] hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-900 dark:text-white">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6d6d70]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all bg-gray-50 dark:bg-[#1c1c1e] focus:bg-white dark:focus:bg-[#2c2c2e] placeholder-gray-400 dark:placeholder-[#6d6d70]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#6d6d70] hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-sm">
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !email || !password || (mode === 'signup' && !confirmPassword)}
            className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 py-2.5 text-sm disabled:bg-gray-200 dark:disabled:bg-[#3a3a3c] disabled:text-gray-400 dark:disabled:text-[#6d6d70] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#3a3a3c] bg-gray-50 dark:bg-[#1c1c1e]">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="ml-1 text-gray-900 dark:text-white hover:underline font-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};