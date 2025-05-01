import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Activity, AlertTriangle, Users, UserPlus, X, Check, BarChart3, Link, RefreshCw } from 'lucide-react';
import axios from 'axios';

function ParentalMonitor() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [safetyFilter, setSafetyFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/insights`);
        setHistory(response.data);
        setFilteredHistory(response.data);
      } catch (err) {
        setError('Failed to fetch scan history');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...history];
      if (typeFilter !== 'all') {
        filtered = filtered.filter(item => item.type?.toLowerCase() === typeFilter);
      }
      if (safetyFilter !== 'all') {
        filtered = filtered.filter(item => safetyFilter === 'safe' ? item.is_safe : !item.is_safe);
      }
      setFilteredHistory(filtered);
    };
    applyFilters();
  }, [typeFilter, safetyFilter, history]);

  const exportToCSV = () => {
    const csvRows = [
      ['Input', 'Type', 'Safety', 'Safety Score', 'Date'],
      ...filteredHistory.map(item => [
        `"${item.input || 'N/A'}"`,
        item.type || 'N/A',
        item.is_safe ? 'Safe' : 'Unsafe',
        item.safety_score ?? 'N/A',
        item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Shield className="mr-2 text-indigo-500" size={28} /> 
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Parental Monitoring
              </span>
            </h2>
            <p className="text-muted-foreground">
              Protect your family and monitor online activities with advanced controls.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn btn-primary bg-indigo-500 hover:bg-indigo-600">
              <UserPlus size={16} className="mr-2" /> Add Child Account
            </button>
            <button className="btn btn-outline border-indigo-200 text-indigo-600 dark:border-indigo-800 dark:text-indigo-400">
              <RefreshCw size={16} className="mr-2" /> Refresh
            </button>
          </div>
        </motion.div>
      </div>

      {/* Status overview section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">Monitored Accounts</p>
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">3</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">Alerts Today</p>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">5</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Activity className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">Protected Hours</p>
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">384</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Child accounts section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Child Accounts</h3>
              <div className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 py-1 px-3">
                3 Active
              </div>
            </div>

            <div className="space-y-4">
              {/* Child account card - first */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    S
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">Sarah</h4>
                    <p className="text-sm text-muted-foreground">Age 14 • Last Activity: 12 min ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      Online
                    </span>
                    <button className="btn btn-sm btn-secondary">Settings</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
                    <p className="text-muted-foreground mb-1">Screen Time Today</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">3h 24m</p>
                      <Clock size={16} className="text-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
                    <p className="text-muted-foreground mb-1">Content Filtered</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">12 sites</p>
                      <Shield size={16} className="text-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
                    <p className="text-muted-foreground mb-1">Alerts</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">2 today</p>
                      <AlertTriangle size={16} className="text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Child account card - second (muted state) */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                    J
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">Jason</h4>
                    <p className="text-sm text-muted-foreground">Age 10 • Last Activity: 1h ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                      Away
                    </span>
                    <button className="btn btn-sm btn-secondary">Settings</button>
                  </div>
                </div>

                {/* Simplified stats row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock size={14} className="text-blue-500 mr-1.5" />
                    <span className="font-medium">1h 47m</span>
                    <span className="text-muted-foreground ml-1">today</span>
                  </div>
                  <div className="flex items-center">
                    <Shield size={14} className="text-blue-500 mr-1.5" />
                    <span className="font-medium">8 sites</span>
                    <span className="text-muted-foreground ml-1">filtered</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle size={14} className="text-blue-500 mr-1.5" />
                    <span className="font-medium">1 alert</span>
                    <span className="text-muted-foreground ml-1">today</span>
                  </div>
                </div>
              </div>

              {/* Child account card - third (simpler version) */}
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                    E
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">Emma</h4>
                    <p className="text-sm text-muted-foreground">Age 8 • Last Activity: 5h ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1.5"></span>
                      Offline
                    </span>
                    <button className="btn btn-sm btn-secondary">Settings</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Usage summary */}
          <div className="card mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Protection Summary</h3>
              <BarChart3 size={20} />
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-100">Sites Blocked</span>
                  <span className="font-medium">47 this week</span>
                </div>
                <div className="h-2 bg-indigo-300/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-100 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-100">Screen Time Limited</span>
                  <span className="font-medium">12h 30m</span>
                </div>
                <div className="h-2 bg-indigo-300/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-100 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-100">Content Filtered</span>
                  <span className="font-medium">89 items</span>
                </div>
                <div className="h-2 bg-indigo-300/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-100 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent alerts */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800">
                <div className="mt-0.5 rounded-full bg-amber-100 dark:bg-amber-800 p-1.5">
                  <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Attempted to access blocked content</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sarah • 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="mt-0.5 rounded-full bg-purple-100 dark:bg-purple-800 p-1.5">
                  <Clock size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Screen time limit reached</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Jason • 3 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <div className="mt-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800 p-1.5">
                  <Link size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">External link clicked</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sarah • 5 hours ago</p>
                </div>
              </div>
              
              <button className="btn btn-sm btn-secondary w-full">
                View All Alerts
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ParentalMonitor;