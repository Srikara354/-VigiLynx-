import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Particles from "@tsparticles/react";
import { loadFull } from 'tsparticles';
import { supabase } from '../supabase';
import Login from './components/Login';
import CyberGuard from './components/CyberGuard';
import ParentalMonitor from './components/ParentalMonitor';
import CyberNews from './components/CyberNews';
import CommunityPost from './components/CommunityPosts';
import ThreatDashboard from './components/ThreatDashboard';

function App() {
  const [view, setView] = useState('cyberguard');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'guest', 'normal', or 'parent'

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        setIsLoggedIn(true);

        let userAccountType = data.session.user.user_metadata?.user_type || localStorage.getItem('vigilynx_account_type') || 'normal';
        if (!data.session.user.user_metadata?.user_type) {
          await supabase.auth.updateUser({ data: { user_type: userAccountType } });
        }
        setUserType(userAccountType);
        localStorage.removeItem('vigilynx_account_type');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserType(null);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);

        let userAccountType = session.user.user_metadata?.user_type || localStorage.getItem('vigilynx_account_type') || 'normal';
        if (!session.user.user_metadata?.user_type) {
          await supabase.auth.updateUser({ data: { user_type: userAccountType } });
        }
        setUserType(userAccountType);
        localStorage.removeItem('vigilynx_account_type');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setUserType(null);
  };

  const shouldShowNavOption = (option) => {
    if (!isLoggedIn) return false;
    if (userType === 'guest') return ['cyberguard', 'news'].includes(option);
    if (userType === 'normal') return option !== 'parental';
    return true;
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 2, random: true },
      move: { enable: true, speed: 1, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
      modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } },
    },
    retina_detect: true,
  };

  return (
    <div className="min-h-screen starry-bg flex flex-col relative">
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#000000] z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            className="signature-text relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            VX
            <span className="center-line">
              <span className="vigilynx-preload">VIGILYNX</span>
            </span>
          </motion.span>
        </motion.div>
      )}
      <motion.header
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: isLoading ? 0 : 1, y: isLoading ? -50 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: isLoading ? 0 : 0.2 }}
        className="w-full py-6 px-8 glass-header sticky top-0 z-20"
      >
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#ffffff] flex items-center animated-text">
            <ShieldCheck className="mr-2 w-8 h-8" />
            <span className="vigilynx-text-multicolor">VIGILYNX</span>
          </h1>
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                {shouldShowNavOption('cyberguard') && (
                  <motion.button
                    onClick={() => setView('cyberguard')}
                    className={`btn-neu ${view === 'cyberguard' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                  >
                    CyberGuard
                  </motion.button>
                )}
                {shouldShowNavOption('parental') && (
                  <motion.button
                    onClick={() => setView('parental')}
                    className={`btn-neu ${view === 'parental' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                  >
                    Parental Monitor
                  </motion.button>
                )}
                {shouldShowNavOption('news') && (
                  <motion.button
                    onClick={() => setView('news')}
                    className={`btn-neu ${view === 'news' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                  >
                    Cybersecurity News
                  </motion.button>
                )}
                {shouldShowNavOption('community') && (
                  <motion.button
                    onClick={() => setView('community')}
                    className={`btn-neu ${view === 'community' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                  >
                    Community Post
                  </motion.button>
                )}
                {shouldShowNavOption('threat') && (
                  <motion.button
                    onClick={() => setView('threat')}
                    className={`btn-neu ${view === 'threat' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                  >
                    Threat Dashboard
                  </motion.button>
                )}
              </nav>
              <motion.button onClick={handleLogout} className="btn-neu btn-neu-secondary animated-text">
                Logout
              </motion.button>
            </div>
          )}
        </div>
      </motion.header>

      <main className="container mx-auto max-w-6xl flex-1 py-12 flex flex-col items-center relative z-10">
        <motion.section
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: isLoading ? 0 : 0.4 }}
          className="text-center py-12 space-y-6 w-full"
        >
          <h2 className="text-5xl font-extrabold text-[#ffffff] drop-shadow-md animated-text main-heading">
            One Click, and Boom! Nah, Not on Our Watch.
          </h2>
        </motion.section>

        <motion.div
          key={view}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.6 }}
          className="w-full"
        >
          {!isLoggedIn && !isLoading && <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} setUserType={setUserType} />}
          {isLoggedIn && view === 'cyberguard' && <CyberGuard />}
          {isLoggedIn && view === 'parental' && userType === 'parent' && <ParentalMonitor />}
          {isLoggedIn && view === 'news' && <CyberNews />}
          {isLoggedIn && view === 'community' && userType !== 'guest' && <CommunityPost />}
          {isLoggedIn && view === 'threat' && userType !== 'guest' && <ThreatDashboard />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;