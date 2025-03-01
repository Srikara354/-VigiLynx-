import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Particles from "@tsparticles/react";
import { loadFull } from 'tsparticles';
import CyberGuard from './components/CyberGuard';
import ParentalMonitor from './components/ParentalMonitor';
import CyberNews from './components/CyberNews';
import CommunityPost from './components/CommunityPosts';
import ThreatDashboard from './components/ThreatDashboard';

function App() {
  const [view, setView] = useState('cyberguard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // 2-second preloader
    return () => clearTimeout(timer);
  }, []);

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
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' },
        resize: true,
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  };

  return (
    <div className="min-h-screen starry-bg flex flex-col relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
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
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <motion.button
                onClick={() => setView('cyberguard')}
                className={`btn-neu ${view === 'cyberguard' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                initial={{ scale: 0 }}
                animate={{ scale: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.4 }}
              >
                CyberGuard
              </motion.button>
              <motion.button
                onClick={() => setView('parental')}
                className={`btn-neu ${view === 'parental' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                initial={{ scale: 0 }}
                animate={{ scale: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.5 }}
              >
                Parental Monitor
              </motion.button>
              <motion.button
                onClick={() => setView('news')}
                className={`btn-neu ${view === 'news' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                initial={{ scale: 0 }}
                animate={{ scale: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.6 }}
              >
                Cybersecurity News
              </motion.button>
              <motion.button
                onClick={() => setView('community')}
                className={`btn-neu ${view === 'community' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                initial={{ scale: 0 }}
                animate={{ scale: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.7 }}
              >
                Community Post
              </motion.button>
              <motion.button
                onClick={() => setView('threat')}
                className={`btn-neu ${view === 'threat' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
                initial={{ scale: 0 }}
                animate={{ scale: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.8 }}
              >
                Threat Dashboard
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto max-w-6xl flex-1 py-12 flex flex-col items-center relative z-10">
        <motion.section
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: isLoading ? 0 : 0.4 }}
          className="text-center py-12 space-y-6 w-full"
        >
<h2 className="text-4xl font-bold text-[#ffffff] drop-shadow-md animated-text main-heading">One Click, AND BOOOOM!! Nah, Not on Our Watch.</h2>        </motion.section>

        <motion.div
          key={view}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: isLoading ? 0 : 0.6 }}
          className="w-full"
        >
          {view === 'cyberguard' && <CyberGuard />}
          {view === 'parental' && <ParentalMonitor />}
          {view === 'news' && <CyberNews />}
          {view === 'community' && <CommunityPost />}
          {view === 'threat' && <ThreatDashboard />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;