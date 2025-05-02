import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import RightMenu from './RightMenu';
import ErrorBoundary from '../ui/ErrorBoundary';
import LoadingScreen from '../LoadingScreen';

function Layout({ children }) {
  const [view, setView] = useState('cyberguard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isLoading } = useAuth();

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout">
      {/* Loading state */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Main layout */}
      {!isLoading && (
        <>
          <Header 
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
          
          {/* Mobile sidebar */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <MobileSidebar
                isOpen={isMobileSidebarOpen}
                setIsOpen={setIsMobileSidebarOpen}
                view={view}
                setView={setView}
              />
            )}
          </AnimatePresence>

          {/* Desktop sidebar */}
          <Sidebar view={view} setView={setView} />

          {/* Right-side hamburger menu */}
          <RightMenu />

          {/* Main content area */}
          <main className="main-container custom-scrollbar">
            <div className="main-content">
              <ErrorBoundary>
                {children(view, setView)}
              </ErrorBoundary>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default Layout;
