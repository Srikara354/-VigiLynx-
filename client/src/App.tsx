import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/components/Dashboard';
// Fix the import by using the default export
import CommunityPostsDemo from '@/components/CommunityPosts';
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import CyberNews from '@/components/CyberNews';  // Import CyberNews component

// Lazy load components for better performance
const Reports = lazy(() => import('@/components/Reports'));
const Settings = lazy(() => import('@/components/Settings'));
const NotFound = lazy(() => import('@/components/NotFound'));
const PasswordChecker = lazy(() => import('@/pages/PasswordChecker'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
            {/* Modern gradient background */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-700" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.12),rgba(0,0,0,0))]" />
            </div>

            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] animate-blob rounded-full bg-indigo-100/40 dark:bg-indigo-900/20 mix-blend-multiply blur-3xl filter" />
              <div className="absolute -right-1/4 top-1/3 h-[600px] w-[600px] animate-blob animation-delay-2000 rounded-full bg-blue-100/40 dark:bg-blue-900/20 mix-blend-multiply blur-3xl filter" />
              <div className="absolute -bottom-1/4 left-1/3 h-[600px] w-[600px] animate-blob animation-delay-4000 rounded-full bg-violet-100/40 dark:bg-violet-900/20 mix-blend-multiply blur-3xl filter" />
            </div>

            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <motion.div
                          key="dashboard"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <Dashboard />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/community"
                      element={
                        <motion.div
                          key="community"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <CommunityPostsDemo />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <motion.div
                          key="reports"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <Reports />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/news"
                      element={
                        <motion.div
                          key="news"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <CyberNews />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <motion.div
                          key="settings"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <Settings />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/password-checker"
                      element={
                        <motion.div
                          key="password-checker"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <PasswordChecker />
                        </motion.div>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <motion.div
                          key="not-found"
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <NotFound />
                        </motion.div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </Layout>
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};