import { motion } from 'framer-motion';
import { ChevronRight, Shield, Users, LineChart, KeyRound, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// No need for useNavigate and routeMap since we're using a view-based system
const navigationItems = [
  { id: 'cyberguard', label: 'CyberGuard', icon: <Shield size={20} /> },
  { id: 'parental', label: 'Parental Monitor', icon: <Users size={20} /> },
  { id: 'threat', label: 'Threat Dashboard', icon: <LineChart size={20} /> },
  { id: 'password-checker', label: 'Password Checker', icon: <KeyRound size={20} /> },
  { id: 'password-generator', label: 'Password Generator', icon: <Key size={20} />, path: '/password-generator' },
];

const shouldShowNavOption = (option, isLoggedIn, userType) => {
  if (!isLoggedIn) return false;
  if (userType === 'guest') return ['cyberguard', 'news', 'password-checker', 'password-generator'].includes(option);
  if (userType === 'normal') return option !== 'parental';
  return true; // Parent sees all
};

function Navigation({ view, setView, isMobile = false, onItemClick = () => {} }) {
  const { isLoggedIn, userType } = useAuth();
  const navigate = useNavigate();

  const NavigationItem = ({ item }) => {
    if (!shouldShowNavOption(item.id, isLoggedIn, userType)) return null;
    
    return (
      <motion.li
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => {
            if (item.path) {
              navigate(item.path);
            } else {
              setView(item.id);
            }
            onItemClick();
          }}
          className={`menu-item group flex items-center w-full px-3 py-3 rounded-lg transition-all-normal ${
            view === item.id ? 'active font-medium' : ''
          }`}
          aria-pressed={view === item.id}
        >
          <motion.span 
            className="mr-3 text-primary"
            animate={{ scale: view === item.id ? 1.1 : 1 }}
            transition={{ duration: 0.2, type: "spring" }}
          >
            {item.icon}
          </motion.span>
          <span>{item.label}</span>
          <motion.span
            className="ml-auto"
            initial={{ opacity: 0, x: -5 }}
            animate={{ 
              opacity: view === item.id ? 1 : 0, 
              x: view === item.id ? 0 : -5 
            }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} />
          </motion.span>
        </button>
      </motion.li>
    );
  };

  return (
    <nav className="p-3">
      <motion.ul 
        className="space-y-1"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: isMobile ? 0.08 : 0,
              delayChildren: isMobile ? 0.1 : 0
            }
          }
        }}
      >
        {navigationItems.map(item => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </motion.ul>
    </nav>
  );
}

export default Navigation;
