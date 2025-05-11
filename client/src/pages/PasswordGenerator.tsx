import { useState, useRef, useEffect } from 'react';
import { Copy, RefreshCw, Check, Lock, AlertTriangle, X, Save, List, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import zxcvbn from 'zxcvbn'; // Add ts-ignore to bypass the module import error
import { useAuth } from '../contexts/AuthContext';
import { savePassword, getSavedPasswords, deleteSavedPassword } from '../utils/passwordSecurity';

// Define interface for saved password
interface SavedPassword {
  id: string;
  user_id: string;
  password_label: string;
  password_value: string;
  username?: string;
  created_at: string;
}

// Define interface for password strength result
interface PasswordStrength {
  score: number;
  feedback: {
    warning?: string;
    suggestions?: string[];
  };
}

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  
  // Add states for saving passwords
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState('');
  const [username, setUsername] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  
  // Add states for viewing saved passwords
  const [showSavedPasswords, setShowSavedPasswords] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState<SavedPassword[]>([]);
  const [loadingPasswords, setLoadingPasswords] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  
  // Authentication context
  const { user, isLoggedIn, userType } = useAuth();
  
  const passwordRef = useRef(null);

  // Generate password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  // Update password strength whenever password changes
  useEffect(() => {
    if (password) {
      const strength = zxcvbn(password);
      setPasswordStrength(strength);
    }
  }, [password]);
  
  // Load saved passwords when the component mounts or when the saved passwords modal is opened
  useEffect(() => {
    if (showSavedPasswords && isLoggedIn && userType !== 'guest' && user?.id) {
      loadSavedPasswords();
    }
  }, [showSavedPasswords, isLoggedIn, userType, user?.id]);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+{}:"<>?|[];\',./`~';

    // If no character sets are selected, default to lowercase
    if (charset === '') {
      charset = 'abcdefghijklmnopqrstuvwxyz';
      setIncludeLowercase(true);
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (passwordRef.current) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Toggle visibility of a saved password
  const togglePasswordVisibility = (passwordId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(passwordId)) {
        newSet.delete(passwordId);
      } else {
        newSet.add(passwordId);
      }
      return newSet;
    });
  };
  
  // Load saved passwords
  const loadSavedPasswords = async () => {
    if (!user?.id) return;
    
    setLoadingPasswords(true);
    try {
      const { data, error } = await getSavedPasswords(user.id);
      
      if (error) throw error;
      
      setSavedPasswords(data || []);
    } catch (error) {
      console.error('Failed to load saved passwords:', error);
    } finally {
      setLoadingPasswords(false);
    }
  };
  
  // Handle saving a password
  const handleSavePassword = async () => {
    setSaveError('');
    setSaveSuccess('');
    
    if (!passwordLabel.trim()) {
      setSaveError('Please enter a label for this password');
      return;
    }
    
    if (!isLoggedIn || userType === 'guest' || !user) {
      setSaveError('You must be logged in to save passwords');
      return;
    }
    
    try {
      const { error } = await savePassword(user.id, password, passwordLabel, username);
      
      if (error) throw error;
      
      setSaveSuccess('Password saved successfully!');
      setPasswordLabel('');
      setUsername('');
      setShowSaveModal(false);
      
      // Refresh the list of saved passwords if it's being displayed
      if (showSavedPasswords) {
        loadSavedPasswords();
      }
    } catch (error) {
      console.error('Failed to save password:', error);
      setSaveError('Failed to save password. Please try again.');
    }
  };
  
  // Handle deleting a saved password
  const handleDeletePassword = async (passwordId: string) => {
    if (!user?.id) return;
    
    if (confirm('Are you sure you want to delete this saved password?')) {
      try {
        const { success, error } = await deleteSavedPassword(passwordId, user.id);
        
        if (error) throw error;
        
        if (success) {
          // Update the saved passwords list
          loadSavedPasswords();
        }
      } catch (error) {
        console.error('Failed to delete password:', error);
        alert('Failed to delete password. Please try again.');
      }
    }
  };

  const getStrengthLabel = (score: number): string => {
    switch(score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Unknown';
    }
  };
  
  const getStrengthColor = (score: number): string => {
    switch(score) {
      case 0: 
      case 1: return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 2: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 3: 
      case 4: return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStrengthBarColor = (score: number): string => {
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
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="p-5 rounded-full bg-primary/10 mb-4">
          <Lock size={48} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-center text-muted-foreground max-w-lg">
          Create strong, secure, and random passwords to keep your accounts safe from hackers and data breaches.
        </p>
      </div>

      <div className="bg-card shadow-md rounded-xl p-6 mb-8">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              ref={passwordRef}
              value={password}
              readOnly
              className="w-full p-4 pr-24 bg-secondary/20 border border-border rounded-lg font-mono text-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                onClick={generatePassword}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
                aria-label="Generate new password"
              >
                <RefreshCw size={20} className="text-primary" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
                aria-label="Copy password"
              >
                {copied ? <Check size={20} className="text-success" /> : <Copy size={20} className="text-primary" />}
              </button>
            </div>
          </div>
          
          {passwordStrength && (
            <div className="mt-4">
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
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex justify-between mb-2">
              <span className="text-sm font-medium">Password Length: {length}</span>
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>8</span>
              <span>16</span>
              <span>24</span>
              <span>32</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="uppercase"
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="uppercase" className="text-sm font-medium">
                Include Uppercase Letters (A-Z)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lowercase"
                checked={includeLowercase}
                onChange={() => setIncludeLowercase(!includeLowercase)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="lowercase" className="text-sm font-medium">
                Include Lowercase Letters (a-z)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="numbers"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="numbers" className="text-sm font-medium">
                Include Numbers (0-9)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="symbols"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="symbols" className="text-sm font-medium">
                Include Symbols (!@#$%^&*)
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button
              onClick={generatePassword}
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Generate New Password
            </button>
            
            <button
              onClick={() => {
                if (!isLoggedIn || userType === 'guest') {
                  alert('You need to be logged in to save passwords.');
                  return;
                }
                setPasswordLabel('');
                setSaveError('');
                setSaveSuccess('');
                setShowSaveModal(true);
              }}
              className="px-4 py-3 bg-secondary text-foreground border border-border rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center"
              disabled={!isLoggedIn || userType === 'guest'}
            >
              <Save size={18} className="mr-2" />
              Save Password
            </button>
          </div>
          
          {isLoggedIn && userType !== 'guest' && (
            <button
              onClick={() => setShowSavedPasswords(true)}
              className="w-full mt-2 px-4 py-2 border border-primary/30 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center"
            >
              <List size={18} className="mr-2" />
              View Saved Passwords
            </button>
          )}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-3">Why Use Strong Passwords?</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Protects your accounts from unauthorized access and identity theft</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Prevents your accounts from being compromised in data breaches</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Reduces the risk of financial loss and privacy invasions</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Protects sensitive personal and professional information</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="text-green-500 mt-1 mr-2" />
            <span className="text-sm">Helps maintain your digital security posture across all online services</span>
          </li>
        </ul>
      </div>
      
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card max-w-md w-full mx-4 p-6 rounded-xl shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Save Password</h3>
                <button 
                  onClick={() => setShowSaveModal(false)} 
                  className="p-1 rounded-full hover:bg-secondary"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Password Label (e.g., "Gmail Account")
                </label>
                <input
                  type="text"
                  value={passwordLabel}
                  onChange={(e) => setPasswordLabel(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-secondary/20"
                  placeholder="Enter a label to identify this password"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-secondary/20"
                  placeholder="Enter the username for this account"
                />
              </div>
              
              {saveError && (
                <div className="p-3 mb-4 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
                </div>
              )}
              
              {saveSuccess && (
                <div className="p-3 mb-4 border rounded-lg bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400">{saveSuccess}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showSavedPasswords && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card max-w-3xl w-full mx-4 p-6 rounded-xl shadow-xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Saved Passwords</h3>
                <button 
                  onClick={() => setShowSavedPasswords(false)} 
                  className="p-1 rounded-full hover:bg-secondary"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-grow">
                {loadingPasswords ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw size={24} className="animate-spin text-primary" />
                  </div>
                ) : savedPasswords.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>You haven't saved any passwords yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedPasswords.map((saved) => (
                      <div 
                        key={saved.id} 
                        className="border border-border rounded-lg p-4 bg-secondary/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{saved.password_label}</h4>
                            {saved.username && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Username: {saved.username}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(saved.password_value);
                                alert('Password copied to clipboard!');
                              }}
                              className="p-1 rounded hover:bg-secondary"
                              title="Copy password"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => togglePasswordVisibility(saved.id)}
                              className="p-1 rounded hover:bg-secondary"
                              title={visiblePasswords.has(saved.id) ? "Hide password" : "Show password"}
                            >
                              {visiblePasswords.has(saved.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              onClick={() => handleDeletePassword(saved.id)}
                              className="p-1 rounded hover:bg-danger/20 text-danger"
                              title="Delete password"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-mono p-2 bg-secondary/20 rounded border border-border overflow-x-auto">
                            {visiblePasswords.has(saved.id) 
                              ? saved.password_value 
                              : '••••••••••••••••••'}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Saved on {new Date(saved.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={() => setShowSavedPasswords(false)}
                  className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PasswordGenerator;