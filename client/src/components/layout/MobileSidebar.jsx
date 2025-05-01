import { motion } from 'framer-motion';
import SidebarProfile from './SidebarProfile';
import Navigation from './Navigation';
import LogoutButton from './LogoutButton';

function MobileSidebar({ isOpen, setIsOpen, view, setView }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sidebar-backdrop"
      onClick={() => setIsOpen(false)}
    >
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className="absolute left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[280px] 
                bg-sidebar text-sidebar-foreground overflow-y-auto custom-scrollbar
                bg-gradient-radial from-accent/5 to-transparent sidebar-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarProfile />
        <Navigation 
          view={view} 
          setView={setView} 
          isMobile={true} 
          onItemClick={() => setIsOpen(false)}
        />
        <LogoutButton />
      </motion.aside>
    </motion.div>
  );
}

export default MobileSidebar;
