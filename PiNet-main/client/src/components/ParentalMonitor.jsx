import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
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
      try {
        const response = await axios.get(`http://localhost:5000/api/insights`);
        setHistory(response.data);
        setFilteredHistory(response.data);
      } catch (err) {
        setError('Failed to fetch history');
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
        filtered = filtered.filter(item => item.type.toLowerCase() === typeFilter);
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
      ['Input', 'Type', 'Safety', 'Date'],
      ...filteredHistory.map(item => [
        `"${item.input}"`,
        item.type,
        item.is_safe ? 'Safe' : 'Unsafe',
        new Date(item.created_at).toLocaleString(),
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card flex flex-col gap-8 items-center w-full bg-white p-8 rounded-lg shadow-md"
    >
      <Lock size={40} className="text-[#00c4b4]" />
      <h2 className="text-3xl font-bold text-[#1f2a44]">Parental Monitor</h2>
      <p className="text-center text-[#6b7280] max-w-md">Keep track of scans and ensure digital safety with ease.</p>
      <div className="flex space-x-4 w-full max-w-md">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input p-3 border border-[#e2e8f0] rounded-md text-[#1f2a44] bg-white focus:border-[#00c4b4] focus:ring-2 focus:ring-[#00c4b4]/50"
        >
          <option value="all">All Types</option>
          <option value="url">URL</option>
          <option value="hash">Hash</option>
          <option value="domain">Domain</option>
          <option value="ip address">IP Address</option>
        </select>
        <select
          value={safetyFilter}
          onChange={(e) => setSafetyFilter(e.target.value)}
          className="input p-3 border border-[#e2e8f0] rounded-md text-[#1f2a44] bg-white focus:border-[#00c4b4] focus:ring-2 focus:ring-[#00c4b4]/50"
        >
          <option value="all">All Safety</option>
          <option value="safe">Safe</option>
          <option value="unsafe">Unsafe</option>
        </select>
        <button
          onClick={exportToCSV}
          className="btn btn-primary bg-[#00c4b4] hover:bg-[#00a89a] text-white transition-colors"
        >
          Export CSV
        </button>
      </div>
      {loading ? (
        <p className="text-[#6b7280]">Loading history...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredHistory.length > 0 ? (
        <div className="w-full space-y-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="output-box p-6 bg-[#f5f7fa] rounded-md">
              <p><strong className="text-[#1f2a44]">Input:</strong> {item.input}</p>
              <p><strong className="text-[#1f2a44]">Type:</strong> {item.type}</p>
              <p>
                <strong className="text-[#1f2a44]">Status:</strong>{' '}
                <span className={item.is_safe ? 'text-[#00c4b4]' : 'text-[#ef4444]'}>
                  {item.is_safe ? 'Safe' : 'Unsafe'}
                </span>
              </p>
              <p className="text-sm text-[#6b7280]">
                <strong>Date:</strong> {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#6b7280]">No matching scan history available.</p>
      )}
    </motion.section>
  );
}

export default ParentalMonitor;