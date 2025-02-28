import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import CyberGuard from './components/CyberGuard';
import ParentalMonitor from './components/ParentalMonitor';
import CyberNews from './components/CyberNews';  // Import the new component

function App() {
  const [view, setView] = useState('cyberguard');

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1f2a44] flex flex-col">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full py-6 px-8 bg-white shadow-md sticky top-0 z-10"
      >
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#00c4b4] flex items-center">
            <ShieldCheck className="mr-2 w-8 h-8" /> PI-Net CyberGuard
          </h1>
          <nav className="flex space-x-6">
            <button
              onClick={() => setView('cyberguard')}
              className={`btn ${view === 'cyberguard' ? 'btn-primary' : 'btn-secondary'}`}
            >
              CyberGuard
            </button>
            <button
              onClick={() => setView('parental')}
              className={`btn ${view === 'parental' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Parental Monitor
            </button>
            <button
              onClick={() => setView('news')}
              className={`btn ${view === 'news' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Cybersecurity News
            </button>
          </nav>
        </div>
      </motion.header>

      <main className="container mx-auto max-w-6xl flex-1 py-12 flex flex-col items-center">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 space-y-6 w-full"
        >
          <h2 className="text-5xl font-extrabold text-[#1f2a44]">Secure Your Digital World</h2>
          <p className="text-lg text-[#6b7280] max-w-2xl">
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
        </motion.div>
      </main>
    </div>
  );
}

export default App;
