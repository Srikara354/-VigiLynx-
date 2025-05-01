import { useState, useReducer, useCallback } from 'react';
import { validateInput } from '../lib/utils';
import { supabase } from '../../supabase';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { scanUrl, scanFile } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Reducer for complex scan state
const scanReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INPUT_TYPE':
      return { ...state, inputType: action.payload, error: null };
    case 'SET_INPUT':
      return { ...state, input: action.payload, error: null };
    case 'SET_FILE':
      return { ...state, file: action.payload, error: null };
    case 'CLEAR_FILE':
      return { ...state, file: null, error: null, isValid: null };
    case 'SET_VALIDATION':
      return { ...state, isValid: action.payload };
    case 'SCAN_START':
      return { ...state, loading: true, error: null, result: null };
    case 'SCAN_SUCCESS':
      return { ...state, loading: false, result: action.payload };
    case 'SCAN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'RESET':
      return { ...initialScanState };
    default:
      return state;
  }
};

const initialScanState = {
  inputType: 'scan',
  input: '',
  file: null,
  loading: false,
  result: null,
  error: null,
  isValid: null
};

export function useScanInput() {
  const [state, dispatch] = useReducer(scanReducer, initialScanState);
  
  // Use debounced validation to avoid excessive validation calls
  const debouncedValidate = useCallback(
    debounce((value, type) => {
      const isValid = validateInput(value, type);
      dispatch({ type: 'SET_VALIDATION', payload: isValid });
    }, 300),
    []
  );

  const setInputType = (type) => {
    dispatch({ type: 'SET_INPUT_TYPE', payload: type });
  };

  const setInput = (value) => {
    dispatch({ type: 'SET_INPUT', payload: value });
    debouncedValidate(value, 'scan');
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      dispatch({ type: 'SET_FILE', payload: e.target.files[0] });
      debouncedValidate(e.target.files[0], 'file');
    }
  };

  const clearFile = () => {
    dispatch({ type: 'CLEAR_FILE' });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!state.isValid) {
      dispatch({ 
        type: 'SCAN_ERROR', 
        payload: `Please enter a valid ${state.inputType === 'scan' ? 'URL, domain, hash, or IP' : 'file'}` 
      });
      return;
    }

    dispatch({ type: 'SCAN_START' });

    try {
      let result;
      if (state.inputType === 'scan') {
        result = await scanUrl(state.input);
      } else if (state.inputType === 'file') {
        result = await scanFile(state.file, (progress) => {
          // Optional: handle upload progress
        });
      }
      dispatch({ type: 'SCAN_SUCCESS', payload: result });
    } catch (err) {
      const errorMessage = err.message || `Failed to analyze ${state.inputType}. Please try again.`;
      dispatch({ type: 'SCAN_ERROR', payload: errorMessage });
      console.error('Analysis error:', err);
    }
  };

  return {
    ...state,
    setInputType,
    setInput,
    handleFileUpload,
    clearFile,
    handleAnalyze
  };
}
