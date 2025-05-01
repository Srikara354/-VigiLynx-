import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, AlertCircle, ArrowRight, Shield, X, FileType, Check, Upload } from 'lucide-react';
import { useScanInput } from '../hooks/useScanInput';
import AlertMessage from './ui/AlertMessage';
import AnalysisResult from './AnalysisResult';

function CyberGuard() {
  const fileInputRef = useRef(null);
  const { 
    inputType, input, file, loading, result, error, isValid,
    setInputType, setInput, handleFileUpload, clearFile, handleAnalyze 
  } = useScanInput();

  const renderFileDetails = () => {
    if (!file) return null;
    
    return (
      <div className="file-input-details">
        <FileType size={20} className="text-primary" />
        <span className="file-input-name">{file.name}</span>
        <button 
          type="button" 
          onClick={() => {
            clearFile();
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="file-input-remove" 
          aria-label="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card card-gradient shadow-hover flex flex-col items-center w-full max-w-3xl mx-auto p-6 sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-6 shadow-glow-primary animate-float"
      >
        <ShieldCheck size={48} className="text-primary" />
      </motion.div>
      
      <div className="text-center max-w-lg mt-6">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          CyberGuard Scanner
        </motion.h2>
        <p className="text-muted-foreground text-balance">
          Scan URLs, files, domains, IPs, or hashes with advanced AI analysis for ultimate protection.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center w-full max-w-md mt-6">
        <button
          type="button"
          onClick={() => setInputType('scan')}
          className={`flex-1 transition-all-normal flex items-center justify-center gap-2 px-5 py-3 rounded-md ${
            inputType === 'scan' 
              ? 'btn-gradient shadow-glow-primary' 
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          aria-pressed={inputType === 'scan'}
        >
          <Shield size={18} className={inputType === 'scan' ? 'animate-pulse' : ''} />
          <span>Scan URL or Hash</span>
        </button>
        <button
          type="button"
          onClick={() => setInputType('file')}
          className={`flex-1 transition-all-normal flex items-center justify-center gap-2 px-5 py-3 rounded-md ${
            inputType === 'file' 
              ? 'btn-gradient shadow-glow-primary' 
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          aria-pressed={inputType === 'file'}
        >
          <FileText size={18} className={inputType === 'file' ? 'animate-pulse' : ''} />
          <span>Scan File</span>
        </button>
      </div>
      
      <form onSubmit={handleAnalyze} className="w-full max-w-lg space-y-6 mt-8">
        <AnimatePresence mode="wait">
          {inputType === 'scan' ? (
            <motion.div
              key="scan-input"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2"
            >
              <label htmlFor="scan-input" className="form-label flex items-center gap-2">
                <span className="text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 12L12 9M12 9L9 12M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Enter URL, domain, hash, or IP address
              </label>
              <div className="input-group">
                <div className="input-group-text">
                  <Shield size={16} className="text-primary" />
                </div>
                <input
                  id="scan-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://example.com or 192.168.1.1"
                  className="input focus:shadow-focus"
                  disabled={loading}
                  aria-describedby="scan-input-help"
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="input-group-text !bg-transparent hover:!bg-muted"
                    aria-label="Clear input"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p id="scan-input-help" className="text-xs text-muted-foreground">
                Enter a URL, domain name, IP address, or file hash to analyze
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file-input"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2"
            >
              <label htmlFor="file-input" className="form-label flex items-center gap-2">
                <span className="text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L8.58579 11.4142C9.36684 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 8H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Select a file to scan
              </label>
              
              <div className="file-input-wrapper">
                <input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  onChange={handleFileUpload}
                  className="file-input"
                  disabled={loading}
                  aria-describedby="file-input-help"
                />
                <label htmlFor="file-input" className="file-input-label">
                  {file ? (
                    <span className="flex items-center gap-2">
                      <Check size={20} className="text-success" />
                      <span>File selected</span>
                    </span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={24} className="text-primary mb-2" />
                      <span>Drop a file here or click to browse</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Supports most common file types
                      </span>
                    </div>
                  )}
                </label>
              </div>
              {renderFileDetails()}
              <p id="file-input-help" className="text-xs text-muted-foreground">
                Upload a file to scan for malware, viruses, and other threats
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {error && (
            <AlertMessage
              variant="error"
              message={error}
              onDismiss={() => setError(null)}
            />
          )}
        </AnimatePresence>
        
        <motion.button
          type="submit"
          disabled={loading || !isValid}
          className={`btn w-full bg-gradient-to-r from-primary to-accent text-primary-foreground transition-all-normal ${loading || !isValid ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-glow-primary'}`}
          whileHover={!(loading || !isValid) ? { scale: 1.02 } : {}}
          whileTap={!(loading || !isValid) ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4C5.373 4 0 9.373 0 16h2a14 14 0 0114-14v2A12 12 0 004 12z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Analyze <ArrowRight className="ml-2 animate-pulse" size={16} />
            </span>
          )}
        </motion.button>
      </form>
      
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full mt-8"
          >
            <AnalysisResult result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default CyberGuard;