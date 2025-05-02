import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, User, Mail, Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabase';
import { useAuth } from '../contexts/AuthContext';
import AlertMessage from './ui/AlertMessage';
import PasswordSecurityCheck from './ui/PasswordSecurityCheck';

function Login() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState('normal');
  
  const { login, signUp, loginWithGoogle, continueAsGuest, authError } = useAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (isSignUp) {
        await signUp(email, password, accountType);
      } else {
        await login(email, password);
      }
    } catch (err) {
      console.error('Email Auth Error:', err.message);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    try {
      await loginWithGoogle(accountType);
    } catch (err) {
      console.error('Google Sign-In Error:', err.message);
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card w-full max-w-2xl flex flex-col md:flex-row overflow-hidden shadow-hover relative bg-card"
      >
        {/* Slogan and decorative elements */}
        <div className="absolute top-0 left-0 right-0 flex flex-col">
          <div className="bg-primary/10 py-1.5 px-4 text-center text-sm font-medium text-primary">
            One Click and boom! Nah not in our Watch
          </div>
          <div className="h-1 bg-gradient-primary"></div>
        </div>
        
        {/* Brand Section - adjusted padding to account for slogan */}
        <div className="md:w-1/2 p-6 sm:p-8 pt-10 sm:pt-10 bg-gradient-radial from-primary/5 to-transparent flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-border">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 p-5 rounded-full bg-primary/10 ring-1 ring-primary/20 animate-float"
          >
            <ShieldCheck size={48} className="text-primary" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-balance text-center bg-gradient-primary bg-clip-text text-transparent animate-gradient-x">VigiLynx</h1>
          
          <p className="text-muted-foreground text-center max-w-xs mb-10">
            Protecting your digital world with advanced threat intelligence and analysis.
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="flex flex-col items-center p-4 glass rounded-lg hover:shadow-hover transition-all-normal">
              <Shield size={18} className="text-primary mb-2" />
              <span className="text-xs font-medium">URL Scanning</span>
            </div>
            <div className="flex flex-col items-center p-4 glass rounded-lg hover:shadow-hover transition-all-normal">
              <Lock size={18} className="text-primary mb-2" />
              <span className="text-xs font-medium">Threat Analysis</span>
            </div>
            <div className="flex flex-col items-center p-4 glass rounded-lg hover:shadow-hover transition-all-normal">
              <User size={18} className="text-primary mb-2" />
              <span className="text-xs font-medium">Parental Controls</span>
            </div>
            <div className="flex flex-col items-center p-4 glass rounded-lg hover:shadow-hover transition-all-normal">
              <Mail size={18} className="text-primary mb-2" />
              <span className="text-xs font-medium">Alert System</span>
            </div>
          </div>
        </div>

        {/* Auth Form Section - adjusted padding to account for slogan */}
        <div className="md:w-1/2 p-6 sm:p-8 pt-10 sm:pt-10 flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-xl font-semibold mb-6"
          >
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </motion.h2>

          <AnimatePresence>
            {(error || authError) && (
              <AlertMessage
                variant="error"
                message={error || authError}
                onDismiss={() => setError(null)}
                className="mb-4"
              />
            )}
          </AnimatePresence>

          <div className="w-full flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAccountType('normal')}
              className={`flex-1 px-3 py-2.5 rounded-md flex justify-center items-center gap-2 transition-all-normal ${
                accountType === 'normal'
                  ? 'btn-gradient shadow-glow-primary'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              aria-pressed={accountType === 'normal'}
            >
              <User size={18} />
              <span className="text-sm">Standard</span>
              {accountType === 'normal' && <CheckCircle size={14} className="ml-1 text-white" />}
            </button>
            <button
              type="button"
              onClick={() => setAccountType('parent')}
              className={`flex-1 px-3 py-2.5 rounded-md flex justify-center items-center gap-2 transition-all-normal ${
                accountType === 'parent'
                  ? 'btn-gradient shadow-glow-primary'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              aria-pressed={accountType === 'parent'}
            >
              <Shield size={18} />
              <span className="text-sm">Parent</span>
              {accountType === 'parent' && <CheckCircle size={14} className="ml-1 text-white" />}
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="w-full space-y-5 mb-6">
            <div className="form-group">
              <label htmlFor="email" className="form-label mb-1.5 block text-sm font-medium">
                Email
              </label>
              <div className="input-group">
                <div className="input-group-text">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="input-group">
                <div className="input-group-text">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                  disabled={isLoading}
                  minLength={isSignUp ? 8 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-group-text !bg-transparent hover:!bg-muted"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && (
                <div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Use at least 8 characters with a mix of letters and numbers.
                  </p>
                  {password && password.length >= 6 && (
                    <PasswordSecurityCheck password={password} className="mt-2" />
                  )}
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`btn w-full btn-gradient shadow-md transition-all-normal ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? '' : (isSignUp ? 'Create Account' : 'Sign In')}
            </motion.button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="btn btn-outline w-full flex items-center justify-center transition-all-normal hover:bg-secondary/50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.07 7.68 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.68 1 4.01 3.93 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={continueAsGuest}
              disabled={isLoading}
              className="btn btn-secondary w-full transition-all-normal"
            >
              <ArrowRight size={16} className="mr-2" />
              Continue as Guest
            </motion.button>
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={toggleAuthMode}
              className="text-primary font-medium ml-1.5 hover:underline focus:outline-none"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;