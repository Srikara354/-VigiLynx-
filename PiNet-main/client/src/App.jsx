import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Moon, Sun } from 'lucide-react';
import Particles from "@tsparticles/react";
import { loadFull } from 'tsparticles';
import CyberGuard from './components/CyberGuard';
import ParentalMonitor from './components/ParentalMonitor';
import CyberNews from './components/CyberNews';
import CommunityPost from './components/CommunityPosts';
import ThreatDashboard from './components/ThreatDashboard';

function App() {
  const [view, setView] = useState('cyberguard');
  const [isDarkMode] = useState(true); // Locked to dark mode
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' }, // White particles
      shape: { type: 'circle' }, // Simpler shape for B&W
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
    <div className="min-h-screen dark starry-bg flex flex-col relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="custom-cursor" style={{ left: cursorPos.x, top: cursorPos.y }}></div>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full py-6 px-8 glass-header sticky top-0 z-20"
      >
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#ffffff] flex items-center animated-text">
            <ShieldCheck className="mr-2 w-8 h-8" /> <span className="vigilynx-text">VIGILYNX</span>
          </h1>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button onClick={() => setView('cyberguard')} className={`btn-neu ${view === 'cyberguard' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}>
                CyberGuard
              </button>
              <button onClick={() => setView('parental')} className={`btn-neu ${view === 'parental' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}>
                Parental Monitor
              </button>
              <button onClick={() => setView('news')} className={`btn-neu ${view === 'news' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}>
                Cybersecurity News
              </button>
              <button onClick={() => setView('community')} className={`btn-neu ${view === 'community' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}>
                Community Post
              </button>
              <button onClick={() => setView('threat')} className={`btn-neu ${view === 'threat' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}>
                Threat Dashboard
              </button>
            </nav>
            <button className="btn-neu p-2 rounded-full animated-text" aria-label="Dark Mode Enabled">
              <Sun size={20} className="text-[#ffffff]" />
            </button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto max-w-6xl flex-1 py-12 flex flex-col items-center relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 space-y-6 w-full"
        >
          <h2 className="text-5xl font-extrabold text-[#ffffff] drop-shadow-md animated-text">Secure Your Digital World</h2>
          <p className="text-lg text-[#cccccc] max-w-2xl animated-text">
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