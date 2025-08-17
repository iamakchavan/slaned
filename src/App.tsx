import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Tasks } from './screens/Tasks';
import { useAuth } from './contexts/AuthContext';

export const App: React.FC = () => {
  const { user, loading, signUp, signIn } = useAuth();
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setError('Full name is required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setAuthLoading(true);
    setError(null);

    try {
      const { error } = authMode === 'signup' 
        ? await signUp(email, password, fullName)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (authMode === 'signup') {
          setError('Check your email for the confirmation link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setAuthLoading(false);
    }
  };



  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/Slane.png"
            alt="Slane"
            className="w-8 h-8"
          />
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if user is not authenticated
  if (!user) {
    // Show welcome screen
    if (!showAuthScreen) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-lg mx-auto">
            {/* Logo Section */}
            <div className="mb-6">
              <img
                src="/Slane.png"
                alt="Slane"
                className="w-10 h-10 mx-auto"
              />
            </div>
            
            {/* Headline */}
            <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-3">
              No teams. No fluff. Just tasks.
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
              Slane is what happens when task apps get out of the way.<br />
              Designed for solo builders who hate busy UIs.
            </p>
            
            {/* Get Started Button */}
            <button
              onClick={() => setShowAuthScreen(true)}
              className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 text-sm font-medium rounded-md transition-all mb-4 w-full md:w-auto"
            >
              Get Started
            </button>
            
            {/* Pricing Information */}
            <div className="space-y-0.5 mb-12">
              <p className="text-xs text-gray-400">
                Free: 5 projects, 50 tasks
              </p>
              <p className="text-xs text-gray-400">
                Premium: $20/month for unlimited
              </p>
            </div>
            
            {/* Footer Links */}
            <div className="flex items-center justify-center space-x-4">
              <a 
                href="#" 
                className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Show auth screen
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="mb-8">
            <img
              src="/Slane.png"
              alt="Slane"
              className="w-10 h-10 mx-auto"
            />
          </div>
          
          {/* Header */}
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            {authMode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {authMode === 'signin' ? 'Sign in to your account to continue' : 'Get started with Slane'}
          </p>
          
          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {/* Full Name Field (Sign Up Only) */}
            {authMode === 'signup' && (
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {authMode === 'signup' && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading || !email || !password || (authMode === 'signup' && (!confirmPassword || !fullName.trim()))}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center gap-2 mt-6"
            >
              {authLoading ? (
                <>
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                'Continue with Email'
              )}
            </button>

            {/* Toggle Auth Mode */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setError(null);
                    setFullName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="ml-1 text-gray-900 hover:underline font-medium"
                >
                  {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show main app if user is authenticated
  return <Tasks />;
};