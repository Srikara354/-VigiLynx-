import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ChevronRight,
  LogOut,
  Shield,
  Users,
  Newspaper,
  MessageSquare,
  LineChart,
  Moon,
  Sun,
  User
} from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Components
import Login from './components/Login';
import CyberGuard from './components/CyberGuard';
import ParentalMonitor from './components/ParentalMonitor';
import CyberNews from './components/CyberNews';
import CommunityPost from './components/CommunityPosts';
import ThreatDashboard from './components/ThreatDashboard';
import AlertMessage from './components/ui/AlertMessage';

function MainContent({ view, setView }) {
  const { isLoggedIn, userType, authError } = useAuth();
  
  // Restricted access component
  const RestrictedAccess = ({ title, description, backToMain }) => (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
      <p className="text-muted-foreground">
        {backToMain}
      </p>
      <div className="mt-6">
        <button 
          onClick={() => setView('cyberguard')} 
          className="btn btn-primary"
        >
          Return to CyberGuard
        </button>
      </div>
    </div>
  );
  
  return (
    <>
      {authError && (
        <AlertMessage
          variant="error"
          message={authError}
          className="mb-6"
        />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full px-4 sm:px-6 lg:px-8"
        >
          {!isLoggedIn ? (
            <div className="flex justify-center py-10 px-4">
              <Login />
            </div>
          ) : view === 'cyberguard' ? (
            <CyberGuard />
          ) : view === 'parental' && userType === 'parent' ? (
            <ParentalMonitor />
          ) : view === 'parental' ? (
            <RestrictedAccess
              title="Access Restricted"
              description="Parental Monitor requires Parent Access level."
              backToMain="This section is only available to accounts with parent privileges. 
                If you believe this is an error, please contact support."
            />
          ) : view === 'news' ? (
            <CyberNews />
          ) : view === 'community' && userType !== 'guest' ? (
            <CommunityPost />
          ) : view === 'community' ? (
            <RestrictedAccess
              title="Community Access"
              description="Community features require a registered account."
              backToMain="Guest users can't access the community features. Please create an account 
                or log in to join the conversation."
            />
          ) : view === 'threat' && userType !== 'guest' ? (
            <ThreatDashboard />
          ) : view === 'threat' ? (
            <RestrictedAccess
              title="Dashboard Access"
              description="Threat Dashboard requires a registered account."
              backToMain="Guest users can't access the threat dashboard. Please create an account 
                or log in to view threat analytics."
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Layout>
        {(view, setView) => <MainContent view={view} setView={setView} />}
      </Layout>
    </AuthProvider>
  );
}

export default App;