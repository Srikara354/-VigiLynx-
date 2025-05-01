import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, BarChart3, Activity, RefreshCw, 
  Calendar, Globe, Hash, Cpu, FileText, Clock, TrendingUp,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../supabase';

function ThreatDashboard() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('7days');

  // Fetch insights from database
  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        // Fetch threat data from Supabase
        const { data, error } = await supabase
          .from('scan_insights')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setInsights(data || []);
      } catch (err) {
        console.error('Error fetching threat insights:', err);
        setError('Failed to load threat data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  // Calculate threat metrics based on insights data
  const metrics = useMemo(() => {
    if (!insights.length) return {
      totalScans: 0,
      threatsDetected: 0,
      safeItems: 0,
      averageSafetyScore: 0,
      threatTypes: {},
      recentThreats: []
    };

    // Filter insights based on timeframe
    const now = new Date();
    const filteredInsights = insights.filter(insight => {
      const createdAt = new Date(insight.created_at);
      const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      
      if (timeframe === '24hours') return diffDays < 1;
      if (timeframe === '7days') return diffDays < 7;
      if (timeframe === '30days') return diffDays < 30;
      return true; // 'all' timeframe
    });

    // Count threats
    const threatsDetected = filteredInsights.filter(item => !item.is_safe).length;
    const safeItems = filteredInsights.filter(item => item.is_safe).length;
    
    // Calculate average safety score
    const totalSafetyScore = filteredInsights.reduce((acc, item) => 
      acc + (item.safety_score || 0), 0);
    const averageSafetyScore = filteredInsights.length 
      ? Math.round(totalSafetyScore / filteredInsights.length) 
      : 0;

    // Collect threat types
    const threatTypes = {};
    filteredInsights.forEach(item => {
      if (!item.is_safe && item.type) {
        threatTypes[item.type] = (threatTypes[item.type] || 0) + 1;
      }
    });

    // Recent threats
    const recentThreats = filteredInsights
      .filter(item => !item.is_safe)
      .slice(0, 5);

    return {
      totalScans: filteredInsights.length,
      threatsDetected,
      safeItems,
      averageSafetyScore,
      threatTypes,
      recentThreats
    };
  }, [insights, timeframe]);

  // Get threat by type percentages for chart
  const threatTypeData = useMemo(() => {
    const { threatTypes, totalScans } = metrics;
    if (!totalScans) return [];
    
    return Object.entries(threatTypes).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalScans) * 100)
    }));
  }, [metrics]);

  // Format database timestamps
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Get icon for threat type
  const getThreatTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'url': return <Globe className="text-blue-500" size={16} />;
      case 'hash': return <Hash className="text-purple-500" size={16} />;
      case 'domain': return <Globe className="text-indigo-500" size={16} />;
      case 'ip address': return <Cpu className="text-emerald-500" size={16} />;
      case 'file': return <FileText className="text-amber-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <BarChart3 className="mr-2 text-blue-500" size={28} />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Threat Dashboard
            </span>
          </h2>
          <p className="text-muted-foreground">
            Comprehensive overview of detected threats and security insights.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex items-center rounded-lg bg-secondary border border-border overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-sm ${timeframe === '24hours' ? 'bg-blue-500 text-white' : 'hover:bg-muted'}`}
              onClick={() => setTimeframe('24hours')}
            >
              24h
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${timeframe === '7days' ? 'bg-blue-500 text-white' : 'hover:bg-muted'}`}
              onClick={() => setTimeframe('7days')}
            >
              7d
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${timeframe === '30days' ? 'bg-blue-500 text-white' : 'hover:bg-muted'}`}
              onClick={() => setTimeframe('30days')}
            >
              30d
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${timeframe === 'all' ? 'bg-blue-500 text-white' : 'hover:bg-muted'}`}
              onClick={() => setTimeframe('all')}
            >
              All
            </button>
          </div>
          
          <button className="btn btn-outline border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 p-4 rounded-lg mb-8">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Dashboard content */}
      {!loading && !error && (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Activity className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Scans</p>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {metrics.totalScans}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">Threats Detected</p>
                  <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {metrics.threatsDetected}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Shield className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">Safe Items</p>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {metrics.safeItems}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <BarChart3 className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Safety Score</p>
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {metrics.averageSafetyScore}%
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - threat distribution */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="card mb-6">
                <h3 className="text-xl font-semibold mb-6">Threat Distribution</h3>
                
                {threatTypeData.length > 0 ? (
                  <div className="space-y-4">
                    {threatTypeData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getThreatTypeIcon(item.type)}
                            <span className="ml-2 font-medium capitalize">{item.type}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.count} detected</span>
                        </div>
                        <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                            className={`h-full rounded-full ${
                              item.type === 'url' ? 'bg-blue-500' :
                              item.type === 'hash' ? 'bg-purple-500' :
                              item.type === 'domain' ? 'bg-indigo-500' :
                              item.type === 'ip address' ? 'bg-emerald-500' :
                              'bg-amber-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No threat data available for the selected timeframe
                  </div>
                )}
              </div>
              
              {/* Recent scans */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Recent Scans</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">Input</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">Safety Score</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {insights.slice(0, 5).map((scan) => (
                        <tr key={scan.id} className="hover:bg-muted/50">
                          <td className="py-2 px-3">
                            <div className="flex items-center">
                              {getThreatTypeIcon(scan.type)}
                              <span className="ml-1.5 capitalize text-sm">{scan.type}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-sm font-medium truncate block max-w-[200px]">{scan.input}</span>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full mr-1.5 ${
                                (scan.safety_score > 70) ? 'bg-green-500' :
                                (scan.safety_score > 40) ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}></span>
                              <span className="text-sm">{scan.safety_score}%</span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              scan.is_safe 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {scan.is_safe ? 'Safe' : 'Threat'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-sm text-muted-foreground">
                            {formatDate(scan.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Security summary card */}
              <div className="card bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Security Summary</h3>
                  <Clock size={20} />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-100">Threats Blocked</span>
                      <span className="font-medium">{metrics.threatsDetected}</span>
                    </div>
                    <div className="h-2 bg-blue-300/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-100 rounded-full" 
                           style={{ width: `${Math.min(100, metrics.threatsDetected * 5)}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-100">Safe Browsing</span>
                      <span className="font-medium">{metrics.averageSafetyScore}%</span>
                    </div>
                    <div className="h-2 bg-blue-300/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-100 rounded-full" 
                           style={{ width: `${metrics.averageSafetyScore}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-100">Scan Coverage</span>
                      <span className="font-medium">{metrics.totalScans} items</span>
                    </div>
                    <div className="h-2 bg-blue-300/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-100 rounded-full" 
                           style={{ width: `${Math.min(100, metrics.totalScans * 2)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Threat alerts */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Threat Alerts</h3>
                
                <div className="space-y-3">
                  {metrics.recentThreats.length > 0 ? (
                    metrics.recentThreats.map((threat) => (
                      <div key={threat.id} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800">
                        <div className="mt-0.5 rounded-full bg-red-100 dark:bg-red-800 p-1.5">
                          <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {threat.input}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground mr-2">
                              {formatDate(threat.created_at)}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 capitalize">
                              {threat.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <Shield className="mr-2" size={18} />
                      <span>No threats detected in this timeframe</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Trend analysis */}
              <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Trend Analysis</h3>
                  <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Based on {metrics.totalScans} scans in the selected period
                </p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Most common threat:</span>
                    <span className="font-medium capitalize">
                      {Object.entries(metrics.threatTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safe rate:</span>
                    <span className="font-medium">
                      {metrics.totalScans ? Math.round((metrics.safeItems / metrics.totalScans) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Threat frequency:</span>
                    <span className="font-medium">
                      {metrics.totalScans ? Math.round((metrics.threatsDetected / metrics.totalScans) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

export default ThreatDashboard;