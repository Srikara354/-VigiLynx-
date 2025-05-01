import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabase';

function Login({ setIsLoggedIn, setUser, setUserType }) {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('normal'); // 'normal' or 'parent'

  const signInWithGoogle = async () => {
    try {
      // First, ensure we'll be able to update the user metadata after login
      localStorage.setItem('vigilynx_account_type', accountType);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: 'http://localhost:5173'
        },
      });
      
      if (error) throw error;
      console.log('Sign-in initiated:', data);
      
      // This won't have an immediate effect since OAuth will redirect,
      // but we handle this in App.jsx when the user returns
      setUserType(accountType);
    } catch (err) {
      console.error('Google Sign-In Error:', err.message);
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      let response;
      
      if (isSignUp) {
        // Sign up with email/password
        response = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_type: accountType, // Store account type in user metadata
            }
          }
        });
      } else {
        // Sign in with email/password
        response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      
      const { data, error } = response;
      
      if (error) throw error;
      
      if (data.user) {
        // Check user metadata for account type or use the selected one
        const userType = data.user.user_metadata?.user_type || accountType;
        setUser(data.user);
        setIsLoggedIn(true);
        setUserType(userType);
        console.log(isSignUp ? 'Sign up successful' : 'Sign in successful', 'as', userType);
      } else if (isSignUp) {
        setError('Please check your email to confirm your account');
      }
    } catch (err) {
      console.error('Email Auth Error:', err.message);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsLoggedIn(true);
    setUser(null);
    setUserType('guest');
    console.log('Continuing as guest');
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 starry-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="card w-full max-w-2xl flex flex-col md:flex-row overflow-hidden border-2 border-[#333333] bg-black"
      >
        {/* Left Section: Branding */}
        <div className="md:w-1/2 bg-black p-8 text-white flex flex-col justify-center items-center border-r border-[#333333]">
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <ShieldCheck size={64} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight vigilynx-text-multicolor">VigiLynx</h1>
          <p className="mt-3 text-sm text-gray-400 text-center max-w-xs">
            Protect your digital world with cutting-edge tools and a thriving community.
          </p>
        </div>

        {/* Right Section: Login Options */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center gap-4 bg-black">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl font-semibold text-white animated-text"
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </motion.h2>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm bg-[#220000] p-2 rounded-lg w-full text-center border border-red-900"
            >
              {error}
            </motion.p>
          )}

          {/* Account Type Selector */}
          <div className="w-full flex gap-2 my-2">
            <button
              type="button"
              onClick={() => setAccountType('normal')}
              className={`w-1/2 p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                accountType === 'normal'
                  ? 'bg-white text-black font-semibold border-2 border-white'
                  : 'bg-transparent text-white border-2 border-[#333333]'
              }`}
            >
              <User size={18} />
              Standard User
            </button>
            <button
              type="button"
              onClick={() => setAccountType('parent')}
              className={`w-1/2 p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                accountType === 'parent'
                  ? 'bg-white text-black font-semibold border-2 border-white'
                  : 'bg-transparent text-white border-2 border-[#333333]'
              }`}
            >
              <ShieldCheck size={18} />
              Parent Access
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="w-full space-y-4 mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full pl-10 pr-4 py-3 rounded-lg border border-[#333333] focus:border-white"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pl-10 pr-12 py-3 rounded-lg border border-[#333333] focus:border-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 12px rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="btn-neu btn-neu-primary w-full"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>
          
          <div className="w-full flex items-center gap-2 my-2">
            <hr className="flex-1 border-[#333333]" />
            <span className="text-xs text-gray-400">OR</span>
            <hr className="flex-1 border-[#333333]" />
          </div>

          {/* Social Login */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 12px rgba(255, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={signInWithGoogle}
            className="btn-neu w-full flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.07 7.68 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.68 1 4.01 3.93 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign {isSignUp ? 'up' : 'in'} with Google
          </motion.button>
          
          {/* Guest Option */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 12px rgba(255, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={continueAsGuest}
            className="btn-neu btn-neu-secondary w-full flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} />
            Continue as Guest
          </motion.button>
          
          {/* Toggle Sign In/Sign Up */}
          <p className="text-sm text-gray-400 mt-4">
            {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
            <button 
              onClick={toggleAuthMode}
              className="text-white font-medium ml-1 hover:text-gray-200 focus:outline-none animated-text"
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