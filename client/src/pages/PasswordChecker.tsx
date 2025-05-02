import { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { checkBreachedPassword, getBreachMessage } from '../utils/passwordSecurity';

const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isBreached, setIsBreached] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Reset breach status when the password changes
    setIsBreached(null);
    setError(null);
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

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="p-5 rounded-full bg-primary/10 mb-4">
          <ShieldAlert size={48} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Password Security Checker</h1>
        <p className="text-center text-muted-foreground max-w-lg">
          Check if your password has been exposed in data breaches. This tool uses the "Have I Been Pwned" database 
          and securely checks your password without sending the full password over the network.
        </p>
      </div>
      
      <div className="bg-card shadow-md rounded-xl p-6 mb-8 max-w-xl mx-auto">
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Enter Password to Check
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
      
      <div className="max-w-xl mx-auto bg-muted/50 rounded-lg p-6">
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