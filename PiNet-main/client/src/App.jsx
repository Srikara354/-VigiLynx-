import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Moon, Sun } from 'lucide-react';
import CyberGuard from './components/CyberGuard';
import ParentalMonitor from './components/ParentalMonitor';
import CyberNews from './components/CyberNews';
import CommunityPost from './components/CommunityPosts';
import ThreatDashboard from './components/ThreatDashboard';

function App() {
  const [view, setView] = useState('cyberguard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark animated-gradient-dark' : 'animated-gradient'} flex flex-col`}>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full py-6 px-8 glass-header sticky top-0 z-10"
      >
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#00c4b4] dark:text-[#80deea] flex items-center">
            <ShieldCheck className="mr-2 w-8 h-8" /> <span className="vigilynx-text">VIGILYNX</span>
          </h1>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button onClick={() => setView('cyberguard')} className={`btn-neu ${view === 'cyberguard' ? 'btn-neu-primary' : 'btn-neu-secondary'}`}>
                CyberGuard
              </button>
              <button onClick={() => setView('parental')} className={`btn-neu ${view === 'parental' ? 'btn-neu-primary' : 'btn-neu-secondary'}`}>
                Parental Monitor
              </button>
              <button onClick={() => setView('news')} className={`btn-neu ${view === 'news' ? 'btn-neu-primary' : 'btn-neu-secondary'}`}>
                Cybersecurity News
              </button>
              <button onClick={() => setView('community')} className={`btn-neu ${view === 'community' ? 'btn-neu-primary' : 'btn-neu-secondary'}`}>
                Community Post
              </button>
              <button onClick={() => setView('threat')} className={`btn-neu ${view === 'threat' ? 'btn-neu-primary' : 'btn-neu-secondary'}`}>
                Threat Dashboard
              </button>
            </nav>
            <button onClick={toggleDarkMode} className="btn-neu p-2 rounded-full" aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun size={20} className="text-[#80deea]" /> : <Moon size={20} className="text-[#6b7280]" />}
            </button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto max-w-6xl flex-1 py-12 flex flex-col items-center">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 space-y-6 w-full"
        >
          <h2 className="text-5xl font-extrabold text-[#1f2a44] dark:text-[#e5e7eb] drop-shadow-md">Secure Your Digital World</h2>
          <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-2xl">
            Advanced AI-powered scanning and parental monitoring to keep you safe online.
          </p>
        </motion.section>

        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {view === 'cyberguard' && <CyberGuard />}
          {view === 'parental' && <CyberGuard />}
          {view === 'news' && <CyberNews />}
          {view === 'community' && <CommunityPost />}
          {view === 'threat' && <ThreatDashboard />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;