import { ShieldCheck, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import MobileNavToggle from './MobileNavToggle';

function Header({ isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header relative shadow-md backdrop-blur-sm bg-background/80">
      <div className="flex items-center gap-2">
        <MobileNavToggle 
          isMobileSidebarOpen={isMobileSidebarOpen} 
          setIsMobileSidebarOpen={setIsMobileSidebarOpen} 
        />
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">VigiLynx</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
