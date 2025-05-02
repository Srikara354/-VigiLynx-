import { useState, useCallback } from 'react';
import { validateInput } from '../lib/utils';
import { scanUrl, scanFile } from '../lib/api';

export function useScanInput() {
  const [inputType, setInputType] = useState('scan');
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const handleInputChange = (value) => {
    setInput(value);
    setError(null);
    setIsValid(validateInput(value, 'scan'));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setIsValid(true); // Assume any file is valid initially
    }
  };

  const clearFile = () => {
    setFile(null);
    setIsValid(null);
    setError(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!isValid) {
      setError(`Please enter a valid ${inputType === 'scan' ? 'URL, domain, hash, or IP' : 'file'}`);
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      console.log(`Starting analysis for ${inputType}:`, inputType === 'scan' ? input : file.name);
      
      let apiResult;
      if (inputType === 'scan') {
        apiResult = await scanUrl(input);
        console.log('Scan URL response:', apiResult);
      } else {
        apiResult = await scanFile(file);
        console.log('Scan file response:', apiResult);
      }
      
      // Transform API response to match AnalysisResult component expectations
      const transformedResult = {
        scan_id: apiResult.recordId || 'unknown',
        target: inputType === 'scan' ? input : file.name,
        input_type: inputType,
        risk_score: apiResult.safetyScore ? 10 - (apiResult.safetyScore / 10) : 5,
        timestamp: new Date().toISOString(),
        summary: apiResult.geminiInsights || 'No detailed analysis available',
        threats: apiResult.vtStats?.malicious > 0 || apiResult.vtStats?.suspicious > 0 ? 
          [{
            name: 'Potential security threat',
            category: apiResult.vtStats?.malicious > 0 ? 'Malicious' : 'Suspicious',
            description: `Detected by ${apiResult.vtStats?.malicious || 0} security vendors as malicious and ${apiResult.vtStats?.suspicious || 0} as suspicious.`
          }] : [],
        recommendation: apiResult.isSafe ? 
          'This item appears to be safe based on our analysis.' : 
          'Exercise caution when interacting with this item. It may contain security risks.',
        source: 'CyberGuard Scanner'
      };

      // Add file-specific properties if it's a file scan
      if (inputType === 'file' && file) {
        transformedResult.file_name = file.name;
        transformedResult.file_type = file.type || 'Unknown';
        transformedResult.file_size = file.size;
      }
      
      console.log('Transformed result:', transformedResult);
      setResult(transformedResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || `Failed to analyze ${inputType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return {
    inputType,
    input,
    file,
    loading,
    result,
    error,
    isValid,
    setInputType,
    setInput: handleInputChange,
    handleFileUpload,
    clearFile,
    handleAnalyze
  };
}
