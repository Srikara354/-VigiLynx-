import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText } from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import AnalysisResult from './AnalysisResult';

function CyberGuard() {
  const [inputType, setInputType] = useState('scan');
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const validateInput = useCallback(
    debounce((value, type) => {
      if (type === 'scan') {
        const isUrl = value.includes('://') || value.startsWith('www.');
        const isHash = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(value);
        const isDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(value);
        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
        setIsValid(isUrl || isHash || isDomain || isIp || value === '');
      } else if (type === 'file') {
        setIsValid(!!value);
      }
    }, 300),
    []
  );

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setError(`Please enter a valid ${inputType === 'scan' ? 'URL, domain, hash, or IP' : 'file'}`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (inputType === 'scan') {
        response = await axios.get(`http://localhost:5000/api/scan`, { params: { input } });
      } else if (inputType === 'file') {
        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post(`http://localhost:5000/api/scan-file`, formData);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to analyze ${inputType}. Details: ${err.response?.data?.details?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card flex flex-col gap-8 items-center w-full bg-[#000000] p-8 rounded-lg shadow-md"
    >
      <ShieldCheck size={40} className="text-[#ffffff]" />
      <h2 className="text-3xl font-bold text-[#ffffff] animated-text">CyberGuard Scanner</h2>
      <p className="text-center text-[#cccccc] max-w-md animated-text">Scan URLs, files, or more with advanced AI for ultimate protection.</p>
      <div className="flex space-x-4">
        <button
          onClick={() => setInputType('scan')}
          className={`btn-neu ${inputType === 'scan' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
        >
          Scan Input
        </button>
        <button
          onClick={() => setInputType('file')}
          className={`btn-neu ${inputType === 'file' ? 'btn-neu-primary' : 'btn-neu-secondary'} animated-text`}
        >
          <FileText size={16} className="mr-2 inline" /> Scan File
        </button>
      </div>
      <form onSubmit={handleAnalyze} className="w-full max-w-md space-y-6">
        {inputType === 'scan' ? (
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              validateInput(e.target.value, 'scan');
            }}
            placeholder="Enter URL, domain, hash, or IP"
            className="input w-full p-3 border border-[#666666] rounded-md text-[#ffffff] placeholder-[#cccccc] focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]/50"
            disabled={loading}
          />
        ) : (
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              validateInput(e.target.files[0], 'file');
            }}
            className="input w-full p-3 border border-[#666666] rounded-md text-[#ffffff] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ffffff] file:text-[#000000] hover:file:bg-[#cccccc]"
            disabled={loading}
          />
        )}
        <button
          type="submit"
          disabled={loading || !isValid}
          className={`btn-neu btn-neu-primary w-full ${loading || !isValid ? 'bg-[#666666] cursor-not-allowed' : ''} text-[#000000] animated-text`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-[#000000]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze'
          )}
        </button>
      </form>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[#ffffff] font-medium text-center animated-text"
        >
          {error}
        </motion.p>
      )}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full mt-8"
        >
          <AnalysisResult result={result} />
        </motion.div>
      )}
    </motion.section>
  );
}

export default CyberGuard;