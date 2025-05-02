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
  User,
  KeyRound
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
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
import PasswordChecker from './pages/PasswordChecker';
import PasswordGenerator from './pages/PasswordGenerator';

// Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

function MainContent({ view, setView }) {
  const { isLoggedIn, userType, authError } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Handle URL parameter for view
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && ['cyberguard', 'parental', 'community', 'threat', 'password-checker'].includes(viewParam)) {
      setView(viewParam);
    }
  }, [searchParams, setView]);
  
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
          ) : view === 'password-checker' ? (
            <PasswordChecker />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Wrapper component to maintain consistent layout for standalone pages
function PageWithLayout({ Component }) {
  // Using a dummy view value that doesn't trigger any specific content in MainContent
  return (
    <Layout>
      {(view, setView) => <Component />}
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/about-us" element={<PageWithLayout Component={AboutUs} />} />
          <Route path="/contact-us" element={<PageWithLayout Component={ContactUs} />} />
          <Route path="/cyber-news" element={<PageWithLayout Component={CyberNews} />} />
          <Route path="/password-generator" element={<PageWithLayout Component={PasswordGenerator} />} />
          <Route path="*" element={
            <Layout>
              {(view, setView) => <MainContent view={view} setView={setView} />}
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;