import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Phone, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { AuthService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth, isAuthenticated } = useAuth();

  // Check URL params for initial mode
  const initialMode = searchParams.get('mode') === 'signup' ? false : true;

  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Get redirect message from sessionStorage
  useEffect(() => {
    const message = sessionStorage.getItem('auth_message');
    if (message) {
      setAuthMessage(message);
      sessionStorage.removeItem('auth_message');
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleGoogleLogin = () => {
    // Store redirect path before OAuth if not already set by ProtectedRoute
    if (!localStorage.getItem('redirectAfterLogin')) {
      // If manually clicking login from a page, redirect back to that page (if not login page itself)
      // But usually login page is distinct. If valid current location exists and isn't login, save it.
      // For now, simpler to just ensure key exists or default to /
    }

    // Redirect to backend OAuth2 endpoint
    // Uses VITE_API_URL from .env (Vercel)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/oauth2/authorize/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        // Login with email/phone and password
        const response = await AuthService.login(formData.email, formData.password);
        if (response.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
          await checkAuth();
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        }
      } else {
        // Registration validation
        if (!formData.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        if (!formData.email.trim() && !formData.phone.trim()) {
          setError('Email or Phone number is required');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const response = await AuthService.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });

        if (response.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
          await checkAuth();
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          setSuccessMessage('Registration successful! Please sign in.');
          setIsLoginMode(true);
          setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 flex items-center justify-center mb-4">
            <img
              src="/ayustore_logo.png"
              alt="AyuStore Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isLoginMode ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {isLoginMode ? 'Sign in to your AyuStore account' : 'Join AyuStore for the best shopping experience'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">

          {/* Auth Required Message */}
          {authMessage && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl text-amber-700 dark:text-amber-300 text-sm flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{authMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl text-green-700 dark:text-green-300 text-sm flex items-center gap-3">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-all duration-200 font-semibold shadow-sm mb-6"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.01.01-.01.01-.01z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name Field - Only in Register Mode */}
            {!isLoginMode && (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {isLoginMode ? 'Email or Phone' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type={isLoginMode ? "text" : "email"}
                  name="email"
                  placeholder={isLoginMode ? "Email or phone number" : "Enter your email"}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Phone Field - Only in Register Mode */}
            {!isLoginMode && (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number <span className="text-slate-400">(optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-14 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Only in Register Mode */}
            {!isLoginMode && (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLoginMode}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button fullWidth type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span className="text-base font-semibold py-1">
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError(null);
                  setSuccessMessage(null);
                  setAuthMessage(null);
                  setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
                }}
                className="ml-2 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Version marker */}
        <p className="mt-6 text-center text-xs text-slate-400">AyuStore Auth v4.0</p>
      </div>
    </div>
  );
};

export default Login;