import { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { checkBreachedPassword, getBreachMessage } from '../../utils/passwordSecurity';

interface PasswordSecurityCheckProps {
  password: string;
  className?: string;
}

const PasswordSecurityCheck = ({ password, className = '' }: PasswordSecurityCheckProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isBreached, setIsBreached] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={`password-security-check mt-2 ${className}`}>
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