import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function LogoutButton() {
  const { logout, isLoggedIn } = useAuth();

  // Don't render the button if user is not logged in
  if (!isLoggedIn) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/20 glass">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="flex items-center w-full px-3 py-2.5 rounded-lg 
                text-sidebar-foreground hover:bg-danger/10 hover:text-danger transition-all-normal"
      >
        <LogOut size={20} className="mr-3" />
        <span>Logout</span>
      </motion.button>
    </div>
  );
}

export default LogoutButton;
