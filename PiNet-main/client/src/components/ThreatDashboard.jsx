import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, BarChart2 } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(PieController, ArcElement, Tooltip, Legend);

function ThreatDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSort, setFilterSort] = useState('all-newest');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('Fetching history from API...');
        const response = await axios.get('http://localhost:5000/api/insights');
        console.log('API response:', response.data);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format: Expected an array');
        }
        setHistory(response.data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const [typeFilter, sortOrder] = filterSort.split('-');
  const filteredHistory = history
    .filter(item => typeFilter === 'all' || (item.type && item.type.toLowerCase() === typeFilter))
    .sort((a, b) => {
      if (!a.created_at || !b.created_at || !a.safety_score || !b.safety_score) return 0;
      if (sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortOrder === 'riskiest') return a.safety_score - b.safety_score;
      if (sortOrder === 'safest') return b.safety_score - a.safety_score;
      return 0;
    });

  const totalScans = filteredHistory.length;
  const safeScans = filteredHistory.filter(item => item.is_safe === true).length;
  const unsafeScans = totalScans - safeScans;
  const unsafePercentage = totalScans > 0 ? Math.round((unsafeScans / totalScans) * 100) : 0;

  const riskData = {
    labels: ['Safe', 'At Risk'],
    datasets: [{
      data: [safeScans, unsafeScans],
      backgroundColor: ['#00d4c4', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const riskOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const riskyInputs = filteredHistory
    .filter(item => item.is_safe === false)
    .sort((a, b) => (a.safety_score || 0) - (b.safety_score || 0))
    .slice(0, 3);

  const typeCounts = filteredHistory.reduce((acc, item) => {
    const type = item.type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];

  const latestScan = filteredHistory[0] || { input: 'N/A', created_at: 'N/A' };

  console.log('Rendering with:', { loading, error, history });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card flex flex-col gap-6 items-center w-full bg-[#1a202c] p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2">
        <Shield size={32} className="text-[#00d4c4]" />
        <h2 className="text-2xl font-bold text-[#e5e7eb] animated-text">Threat Snapshot</h2>
      </div>
      <p className="text-sm text-[#b0b8c9] text-center animated-text">Your scan history at a glance.</p>

      {loading ? (
        <p className="text-[#b0b8c9] animated-text">Loading snapshot...</p>
      ) : error ? (
        <p className="text-[#ef4444] animated-text">{error}</p>
      ) : totalScans === 0 ? (
        <p className="text-[#b0b8c9] animated-text">No scan history available.</p>
      ) : (
        <>
          <div className="w-full flex justify-end">
            <select
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              className="text-sm p-2 border border-[#4a5568] rounded-md bg-[#2d3748] text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#00d4c4] hover:bg-[#4a5568] transition-colors animated-text"
            >
              <optgroup label="All Types">
                <option value="all-newest">All - Newest First</option>
                <option value="all-oldest">All - Oldest First</option>
                <option value="all-riskiest">All - Riskiest First</option>
                <option value="all-safest">All - Safest First</option>
              </optgroup>
              <optgroup label="URLs">
                <option value="url-newest">URLs - Newest First</option>
                <option value="url-oldest">URLs - Oldest First</option>
                <option value="url-riskiest">URLs - Riskiest First</option>
                <option value="url-safest">URLs - Safest First</option>
              </optgroup>
              <optgroup label="Domains">
                <option value="domain-newest">Domains - Newest First</option>
                <option value="domain-oldest">Domains - Oldest First</option>
                <option value="domain-riskiest">Domains - Riskiest First</option>
                <option value="domain-safest">Domains - Safest First</option>
              </optgroup>
              <optgroup label="IP Addresses">
                <option value="ip address-newest">IPs - Newest First</option>
                <option value="ip address-oldest">IPs - Oldest First</option>
                <option value="ip address-riskiest">IPs - Riskiest First</option>
                <option value="ip address-safest">IPs - Safest First</option>
              </optgroup>
              <optgroup label="Hashes">
                <option value="hash-newest">Hashes - Newest First</option>
                <option value="hash-oldest">Hashes - Oldest First</option>
                <option value="hash-riskiest">Hashes - Riskiest First</option>
                <option value="hash-safest">Hashes - Safest First</option>
              </optgroup>
            </select>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center p-4 bg-[#4a5568] rounded-md"
            >
              <h3 className="text-lg font-semibold text-[#e5e7eb] mb-2 animated-text">Scan Overview</h3>
              <div className="flex items-center justify-center w-24 h-24">
                <Pie data={riskData} options={riskOptions} />
              </div>
              <p className="mt-2 text-sm text-[#b0b8c9] animated-text">
                <span className="text-[#00d4c4] font-bold">{safeScans}</span> Safe
              </p>
              <p className="text-sm text-[#b0b8c9] animated-text">
                <span className="text-[#ef4444] font-bold">{unsafeScans}</span> At Risk
              </p>
              <p className="mt-1 text-xs text-[#b0b8c9] animated-text">{unsafePercentage}% Risk Rate</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex flex-col p-4 bg-[#4a5568] rounded-md"
            >
              <h3 className="text-lg font-semibold text-[#e5e7eb] mb-2 flex items-center animated-text">
                <AlertTriangle className="mr-2 text-[#ef4444]" size={20} /> Top Risks
              </h3>
              {riskyInputs.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {riskyInputs.map(item => (
                    <li key={item.id} className="flex justify-between items-center animated-text">
                      <span className="text-[#b0b8c9] truncate max-w-[200px]">{item.input || 'N/A'}</span>
                      <span className="text-[#ef4444] font-semibold">{item.safety_score || 'N/A'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#b0b8c9] animated-text">No risks detected.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex flex-col p-4 bg-[#4a5568] rounded-md"
            >
              <h3 className="text-lg font-semibold text-[#e5e7eb] mb-2 flex items-center animated-text">
                <BarChart2 className="mr-2" size={20} /> Quick Insights
              </h3>
              <p className="text-sm text-[#b0b8c9] animated-text">
                <strong>Total Scans:</strong> {totalScans}
              </p>
              <p className="text-sm text-[#b0b8c9] animated-text">
                <strong>Most Scanned:</strong> {topType[0]} ({topType[1]})
              </p>
              <p className="text-sm text-[#b0b8c9] mt-2 animated-text">
                <strong>Recent Activity:</strong>
              </p>
              <p className="text-xs text-[#b0b8c9] truncate animated-text">
                {latestScan.input} - {new Date(latestScan.created_at).toLocaleDateString() || 'N/A'}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </motion.section>
  );
}

export default ThreatDashboard;