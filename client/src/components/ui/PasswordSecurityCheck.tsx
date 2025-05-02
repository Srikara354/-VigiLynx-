import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Lock } from 'lucide-react';
import { checkBreachedPassword, getBreachMessage } from '../../utils/passwordSecurity';
import zxcvbn from 'zxcvbn';

interface PasswordSecurityCheckProps {
  password: string;
  className?: string;
}

const PasswordSecurityCheck = ({ password, className = '' }: PasswordSecurityCheckProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isBreached, setIsBreached] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  // Check password strength whenever password changes
  useEffect(() => {
    if (password && password.length >= 6) {
      const strength = zxcvbn(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const checkPassword = async () => {
    if (!password || password.length < 6) return;
    
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

  // Trigger the check when password changes and is valid
  const handleCheckPassword = () => {
    if (password && password.length >= 6) {
      checkPassword();
    } else {
      setIsBreached(null); // Reset when password is too short
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

  return (
    <div className={`password-security-check mt-2 ${className}`}>
      {/* Password Strength Indicator */}
      {password && password.length >= 6 && passwordStrength && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Password Strength:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStrengthColor(passwordStrength.score)}`}>
              {getStrengthLabel(passwordStrength.score)}
            </span>
          </div>
          
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                passwordStrength.score <= 1 
                  ? 'bg-red-500' 
                  : passwordStrength.score === 2 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
            ></div>
          </div>
          
          {/* Display feedback */}
          {passwordStrength.feedback.warning && (
            <div className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
              {passwordStrength.feedback.warning}
            </div>
          )}
          
          {passwordStrength.feedback.suggestions.length > 0 && (
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {passwordStrength.feedback.suggestions[0]}
            </div>
          )}
        </div>
      )}
      
      {/* Breach check button */}
      {password && password.length >= 6 && (
        <button 
          type="button"
          onClick={handleCheckPassword}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
          disabled={isChecking}
        >
          Check if password has been breached
        </button>
      )}
      
      {isChecking && (
        <div className="flex items-center gap-2 mt-1 text-yellow-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Checking password security...</span>
        </div>
      )}
      
      {isBreached !== null && !isChecking && (
        <div className={`flex items-center gap-2 mt-1 ${isBreached ? 'text-red-600' : 'text-green-600'}`}>
          {isBreached ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{getBreachMessage(isBreached)}</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 mt-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PasswordSecurityCheck;