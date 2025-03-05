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
      ['Input', 'Type', 'Safety', 'Safety Score', 'Date'],
      ...filteredHistory.map(item => [
        `"${item.input}"`,
        item.type,
        item.is_safe ? 'Safe' : 'Unsafe',
        item.safety_score,
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
      className="card flex flex-col gap-8 items-center w-full bg-[#000000] p-8 rounded-lg shadow-md"
    >
      <Lock size={40} className="text-[#ffffff]" />
      <h2 className="text-3xl font-bold text-[#ffffff] animated-text">Parental Monitor</h2>
      <p className="text-center text-[#cccccc] max-w-md animated-text">Keep track of scans and ensure digital safety with ease.</p>
      <div className="flex space-x-4 w-full max-w-md">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input p-3 border border-[#666666] rounded-md text-[#ffffff] bg-[#000000] focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]/50 animated-text"
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
          className="input p-3 border border-[#666666] rounded-md text-[#ffffff] bg-[#000000] focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]/50 animated-text"
        >
          <option value="all">All Safety</option>
          <option value="safe">Safe</option>
          <option value="unsafe">Unsafe</option>
        </select>
        <button
          onClick={exportToCSV}
          className="btn-neu btn-neu-primary bg-[#ffffff] hover:bg-[#cccccc] text-[#000000] transition-colors animated-text"
        >
          Export CSV
        </button>
      </div>
      {loading ? (
        <p className="text-[#cccccc] animated-text">Loading history...</p>
      ) : error ? (
        <p className="text-[#ffffff] animated-text">{error}</p>
      ) : filteredHistory.length > 0 ? (
        <div className="w-full space-y-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="output-box p-6 bg-[#666666] rounded-md">
              <p className="animated-text"><strong className="text-[#ffffff]">Input:</strong> {item.input}</p>
              <p className="animated-text"><strong className="text-[#ffffff]">Type:</strong> {item.type}</p>
              <p className="animated-text">
                <strong className="text-[#ffffff]">Status:</strong>{' '}
                <span className={item.is_safe ? 'text-[#00c4b4]' : 'text-[#ef4444]'}>
                  {item.is_safe ? 'Safe' : 'Unsafe'}
                </span>
              </p>
              <p className="text-sm text-[#cccccc] animated-text">
                <strong>Safety Score:</strong> {item.safety_score}/100
              </p>
              <p className="text-sm text-[#cccccc] animated-text">
                <strong>Date:</strong> {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#cccccc] animated-text">No matching scan history available.</p>
      )}
    </motion.section>
  );
}

export default ParentalMonitor;