import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Activity,
  Lock,
  Bell,
  Settings,
  Moon,
  Sun,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Modal } from './ui/Modal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

const glassEffect = "backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 shadow-2xl";
const cardHoverEffect = "hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]";
const gradientBorder = "before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-indigo-500 before:to-violet-500 before:rounded-[inherit] before:mask-border before:mask-composite-exclude before:content-['']";

export const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const controls = useAnimation();

  useEffect(() => {
    if (isScanning) {
      controls.start(pulseAnimation);
    } else {
      controls.stop();
    }
  }, [isScanning, controls]);

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanProgress(0);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const securityMetrics = [
    {
      title: 'Threat Level',
      value: 'Low',
      change: '-2%',
      trend: 'down',
      icon: Shield,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'Active Threats',
      value: '2',
      change: '-1',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'System Health',
      value: '98%',
      change: '+0.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'Security Score',
      value: '92/100',
      change: '+2.5%',
      trend: 'up',
      icon: Lock,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Suspicious login attempt detected',
      time: '5 minutes ago',
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: 'success',
      message: 'System scan completed successfully',
      time: '1 hour ago',
      icon: CheckCircle2,
    },
    {
      id: 3,
      type: 'error',
      message: 'Firewall rule update required',
      time: '2 hours ago',
      icon: XCircle,
    },
  ];

  const quickActions = [
    {
      title: 'Start Scan',
      description: 'Initiate a full system security scan',
      icon: Activity,
      action: () => setIsScanning(true),
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'View Alerts',
      description: 'Check recent security notifications',
      icon: Bell,
      action: () => console.log('View alerts'),
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'Settings',
      description: 'Configure security preferences',
      icon: Settings,
      action: () => console.log('Open settings'),
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-3000" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-8 rounded-[2rem] ${glassEffect} ${cardHoverEffect} ${gradientBorder}`}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg group"
                >
                  <Shield className="h-8 w-8 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                    Security Dashboard
                  </h1>
                  <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                    Monitor and manage your security status
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl ${glassEffect} text-slate-600 dark:text-slate-300 transition-colors duration-200 hover:bg-white/90 dark:hover:bg-slate-700/90`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>
              <motion.button
                onClick={handleStartScan}
                disabled={isScanning}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                animate={controls}
                className={`relative rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group ${glassEffect}`}
              >
                {isScanning ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Scanning...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center">
                      <Zap className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                      Start Security Scan
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Security Metrics */}
          <motion.div
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                onHoverStart={() => setHoveredMetric(metric.title)}
                onHoverEnd={() => setHoveredMetric(null)}
                className={`group relative rounded-[1.5rem] p-6 ${glassEffect} ${cardHoverEffect} ${gradientBorder} transition-all duration-300`}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`relative rounded-2xl p-3 bg-gradient-to-br ${metric.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <metric.icon className="h-6 w-6 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    {hoveredMetric === metric.title && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 rounded-full p-1 shadow-lg"
                      >
                        <ShieldCheck className="h-4 w-4 text-indigo-500" />
                      </motion.div>
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {metric.title}
                    </p>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {metric.value}
                      </p>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          metric.trend === 'up'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="ml-1">{metric.change}</span>
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={containerVariants}
            className="grid gap-6 lg:grid-cols-3"
          >
            {/* Recent Alerts */}
            <div className="lg:col-span-2">
              <motion.div
                variants={itemVariants}
                className={`relative rounded-[1.5rem] p-6 ${glassEffect} ${cardHoverEffect} ${gradientBorder}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg group">
                      <Bell className="h-5 w-5 text-white" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Recent Alerts
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View All
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {recentAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`relative flex items-center justify-between rounded-2xl p-4 ${glassEffect} ${cardHoverEffect} transition-all duration-200`}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className={`relative rounded-xl p-2.5 shadow-lg bg-indigo-50 dark:bg-indigo-900/20`}
                          >
                            <alert.icon
                              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                            />
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                          </motion.div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {alert.message}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {alert.time}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div>
              <motion.div
                variants={itemVariants}
                className={`relative rounded-[1.5rem] p-6 ${glassEffect} ${cardHoverEffect} ${gradientBorder}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg group">
                      <Zap className="h-5 w-5 text-white" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Quick Actions
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    More
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.title}
                      onClick={action.action}
                      whileHover={{ scale: 1.02, y: -2, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex w-full items-center space-x-4 rounded-2xl p-4 text-left transition-all ${glassEffect} ${cardHoverEffect} hover:border-indigo-200 dark:hover:border-indigo-500/30`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`relative rounded-xl bg-gradient-to-br ${action.gradient} p-2.5 shadow-lg`}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                      </motion.div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {action.title}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {action.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scanning Modal */}
        <Modal
          isOpen={isScanning}
          onClose={() => {}}
          title="Security Scan in Progress"
          description="Please wait while we analyze your system for potential threats."
        >
          <div className="mt-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                    {scanProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.2 }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Scanning system files...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center"
              >
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Checking for vulnerabilities...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center"
              >
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing network connections...
              </motion.p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}; 