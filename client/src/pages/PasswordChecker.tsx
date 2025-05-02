import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Lock, Eye, EyeOff, ShieldAlert, Info } from 'lucide-react';
import { checkBreachedPassword, getBreachMessage } from '../utils/passwordSecurity';
import zxcvbn from 'zxcvbn';

const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [strengthPassword, setStrengthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showStrengthPassword, setShowStrengthPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isBreached, setIsBreached] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  // Check password strength whenever strengthPassword changes
  useEffect(() => {
    if (strengthPassword) {
      const strength = zxcvbn(strengthPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [strengthPassword]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Reset breach status when the password changes
    setIsBreached(null);
    setError(null);
  };

  const handleStrengthPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrengthPassword(e.target.value);
  };

  const checkPassword = async () => {
    if (!password || password.length < 6) {
      setError('Please enter a password with at least 6 characters');
      return;
    }
    
    setIsChecking(true);
    setError(null);
    
    try {
      const breached = await checkBreachedPassword(password);
      setIsBreached(breached);
    } catch (err) {
      setError('Could not check password security. Please try again later.');
      console.error('Password breach check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  // Get strength label
  const getStrengthLabel = (score: number) => {
    switch(score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Unknown';
    }
  };
  
  // Get appropriate color class based on score
  const getStrengthColor = (score: number) => {
    switch(score) {
      case 0: 
      case 1: return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 2: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 3: 
      case 4: return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Get appropriate background color for progress bar
  const getStrengthBarColor = (score: number) => {
    switch(score) {
      case 0: 
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: 
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="p-5 rounded-full bg-primary/10 mb-4">
          <ShieldAlert size={48} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Password Security Checker</h1>
        <p className="text-center text-muted-foreground max-w-lg">
          Check your password strength and whether it has been exposed in data breaches to ensure your online accounts remain secure.
        </p>
      </div>
      
      {/* Password security boxes in a grid - side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Password Strength Checker Box */}
        <div className="bg-card shadow-md rounded-xl p-6 h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Lock className="mr-2 text-primary" size={20} />
            Password Strength Checker
          </h2>
          <div className="mb-6">
            <label htmlFor="strength-password" className="block text-sm font-medium mb-2">
              Enter Password to Check Strength
            </label>
            <div className="flex relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={16} className="text-muted-foreground" />
              </div>
              <input
                id="strength-password"
                type={showStrengthPassword ? "text" : "password"}
                value={strengthPassword}
                onChange={handleStrengthPasswordChange}
                placeholder="Enter password to analyze strength"
                className="block w-full pl-10 pr-12 py-2.5 text-sm rounded-lg border border-input bg-background"
              />
              <button
                type="button"
                onClick={() => setShowStrengthPassword(!showStrengthPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showStrengthPassword ? 
                  <EyeOff size={16} className="text-muted-foreground" /> : 
                  <Eye size={16} className="text-muted-foreground" />
                }
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Password analysis is performed entirely in your browser - your password is never sent to our servers.
            </p>
          </div>
          
          {passwordStrength && (
            <div className="mt-4 p-4 border rounded-lg bg-secondary/10 border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Strength:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStrengthColor(passwordStrength.score)}`}>
                  {getStrengthLabel(passwordStrength.score)}
                </span>
              </div>
              
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full ${getStrengthBarColor(passwordStrength.score)}`}
                  style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                ></div>
              </div>
              
              {passwordStrength.feedback.warning && (
                <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 mb-3">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center mb-1">
                    <AlertTriangle size={14} className="mr-1" /> Warning
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">{passwordStrength.feedback.warning}</p>
                </div>
              )}
              
              {passwordStrength.feedback.suggestions.length > 0 && (
                <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center mb-1">
                    <Info size={14} className="mr-1" /> Suggestions to improve
                  </p>
                  <ul className="list-disc pl-5 text-sm text-blue-600 dark:text-blue-400">
                    {passwordStrength.feedback.suggestions.map((suggestion: string, i: number) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium block mb-1">Estimated guesses:</span>
                  <span className="font-mono">{passwordStrength.guesses.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium block mb-1">Crack time estimate:</span>
                  <span className="font-mono">{passwordStrength.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Breach Checker Box */}
        <div className="bg-card shadow-md rounded-xl p-6 h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShieldAlert className="mr-2 text-primary" size={20} />
            Data Breach Checker
          </h2>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Enter Password to Check for Breaches
            </label>
            <div className="flex relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={16} className="text-muted-foreground" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password to check"
                className="block w-full pl-10 pr-12 py-2.5 text-sm rounded-lg border border-input bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? 
                  <EyeOff size={16} className="text-muted-foreground" /> : 
                  <Eye size={16} className="text-muted-foreground" />
                }
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your password is never sent to our servers and is securely checked using k-anonymity.
            </p>
          </div>
          
          <button
            onClick={checkPassword}
            disabled={isChecking || !password}
            className="w-full py-2.5 px-4 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? 
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                <span>Checking password...</span>
              </div> : 
              'Check Password'
            }
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertTriangle className="text-red-500 dark:text-red-400 mt-0.5 mr-2" size={16} />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}
          
          {isBreached !== null && !isChecking && !error && (
            <div className={`mt-4 p-4 ${isBreached ? 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'} border rounded-lg`}>
              <div className="flex items-center">
                {isBreached ? (
                  <AlertTriangle className="text-red-500 dark:text-red-400 mr-3" size={20} />
                ) : (
                  <CheckCircle className="text-green-500 dark:text-green-400 mr-3" size={20} />
                )}
                <h3 className={`font-medium ${isBreached ? 'text-red-800 dark:text-red-400' : 'text-green-800 dark:text-green-400'}`}>
                  {isBreached ? 'Password Compromised' : 'Password Secure'}
                </h3>
              </div>
              <p className={`mt-2 text-sm ${isBreached ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>
                {getBreachMessage(isBreached)}
              </p>
              {isBreached && (
                <div className="mt-3 text-sm">
                  <strong>Recommendations:</strong>
                  <ul className="list-disc ml-5 mt-1 text-red-600 dark:text-red-300">
                    <li>Change this password on any site where you use it</li>
                    <li>Use a unique password for each account</li>
                    <li>Consider using a password manager</li>
                    <li>Enable two-factor authentication where available</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto bg-muted/50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-3">Password Security Tips</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Use long passwords (at least 12 characters)</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Combine uppercase letters, lowercase letters, numbers, and symbols</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Avoid using personal information like names, birthdates, or common words</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Use different passwords for different accounts</span>
          </li>
          <li className="flex items-start">
            <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Consider using a password manager to generate and store strong passwords</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordChecker;