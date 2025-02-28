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
      className="card flex flex-col gap-8 items-center w-full bg-[#1a202c] p-8 rounded-lg shadow-md"
    >
      <Lock size={40} className="text-[#00d4c4]" />
      <h2 className="text-3xl font-bold text-[#e5e7eb] animated-text">Parental Monitor</h2>
      <p className="text-center text-[#b0b8c9] max-w-md animated-text">Keep track of scans and ensure digital safety with ease.</p>
      <div className="flex space-x-4 w-full max-w-md">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input p-3 border border-[#4a5568] rounded-md text-[#e5e7eb] bg-[#2d3748] focus:border-[#00d4c4] focus:ring-2 focus:ring-[#00d4c4]/50 animated-text"
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
          className="input p-3 border border-[#4a5568] rounded-md text-[#e5e7eb] bg-[#2d3748] focus:border-[#00d4c4] focus:ring-2 focus:ring-[#00d4c4]/50 animated-text"
        >
          <option value="all">All Safety</option>
          <option value="safe">Safe</option>
          <option value="unsafe">Unsafe</option>
        </select>
        <button
          onClick={exportToCSV}
          className="btn-neu btn-neu-primary bg-[#00d4c4] hover:bg-[#00b4a4] text-[#ffffff] transition-colors animated-text"
        >
          Export CSV
        </button>
      </div>
      {loading ? (
        <p className="text-[#b0b8c9] animated-text">Loading history...</p>
      ) : error ? (
        <p className="text-[#ef4444] animated-text">{error}</p>
      ) : filteredHistory.length > 0 ? (
        <div className="w-full space-y-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="output-box p-6 bg-[#4a5568] rounded-md">
              <p className="animated-text"><strong className="text-[#e5e7eb]">Input:</strong> {item.input}</p>
              <p className="animated-text"><strong className="text-[#e5e7eb]">Type:</strong> {item.type}</p>
              <p className="animated-text">
                <strong className="text-[#e5e7eb]">Status:</strong>{' '}
                <span className={item.is_safe ? 'text-[#00d4c4]' : 'text-[#ef4444]'}>
                  {item.is_safe ? 'Safe' : 'Unsafe'}
                </span>
              </p>
              <p className="text-sm text-[#b0b8c9] animated-text">
                <strong>Date:</strong> {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#b0b8c9] animated-text">No matching scan history available.</p>
      )}
    </motion.section>
  );
}

export default ParentalMonitor;