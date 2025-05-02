import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Info, Mail, ArrowRight, Newspaper, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RightMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Don't render the menu if user is not logged in
  if (!isLoggedIn) return null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleCommunityClick = () => {
    closeMenu();
    // This will navigate to home and then the MainContent will show community when we set this view
    navigate('/?view=community');
    // If you have a global state for view, you could set it here
    // For example: setGlobalView('community');
  };

  return (
    <div className="right-menu-container">
      {/* Hamburger menu button */}
      <button 
        onClick={toggleMenu} 
        className="right-menu-toggle p-2 rounded-full bg-primary text-white hover:bg-primary/90 fixed right-6 top-20 z-50 shadow-md"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-card shadow-xl z-50 p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button 
                onClick={toggleMenu} 
                className="p-2 rounded-full hover:bg-secondary"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-4">
              <Link 
                to="/cyber-news"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-all-normal w-full"
              >
                <Newspaper size={20} className="text-primary" />
                <span className="font-medium">Cybersecurity News</span>
                <ArrowRight size={16} className="ml-auto" />
              </Link>
              
              <button 
                onClick={handleCommunityClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-all-normal w-full text-left"
              >
                <MessageSquare size={20} className="text-primary" />
                <span className="font-medium">Community</span>
                <ArrowRight size={16} className="ml-auto" />
              </button>
              
              <Link 
                to="/about-us"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-all-normal w-full"
              >
                <Info size={20} className="text-primary" />
                <span className="font-medium">About Us</span>
                <ArrowRight size={16} className="ml-auto" />
              </Link>
              
              <Link 
                to="/contact-us"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-all-normal w-full"
              >
                <Mail size={20} className="text-primary" />
                <span className="font-medium">Contact Us</span>
                <ArrowRight size={16} className="ml-auto" />
              </Link>
            </nav>

            <div className="mt-auto pt-4 text-sm text-muted-foreground">
              <p>© 2025 VigiLynx. All rights reserved.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RightMenu;