import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import FormData from 'form-data';
import { Server } from 'socket.io';
import http from 'http';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';
import { body, query, validationResult } from 'express-validator';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
});
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());

app.use(express.json());
const upload = multer({ 
  limits: { 
    fileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024 // Default 50MB
  } 
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

// Stricter rate limiting middleware
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit file uploads to 30 per window
  message: 'Too many file uploads from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Standard limiter for other endpoints
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply appropriate rate limiters
app.use('/api/scan-file', strictLimiter);
app.use(standardLimiter);

// Middleware to validate and sanitize inputs
const validateInput = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

async function fetchGeminiData(type, input, vtStats, vtFullData) {
  console.log(`Fetching Gemini data for ${type}: ${input}`);
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is missing in .env');
    throw new Error('Gemini API key is not configured');
  }

  const total = (vtStats.harmless + vtStats.undetected + vtStats.malicious + vtStats.suspicious + (vtStats.timeout || 0)) || 1;
  const safePercentage = Math.round(((vtStats.harmless + vtStats.undetected) / total) * 100);
  const maliciousPercentage = Math.round((vtStats.malicious / total) * 100);
  const suspiciousPercentage = Math.round((vtStats.suspicious / total) * 100);

  const prompt = `
    Analyze ${type}: ${input} for cybersecurity purposes with detailed insights.
    VirusTotal stats: ${JSON.stringify(vtStats)}.
    Threat names: ${vtFullData.threat_names?.join(', ') || 'None'}.
    Categories: ${Object.values(vtFullData.categories || {}).join(', ') || 'Unknown'}.
    Reputation: ${vtFullData.reputation || 'N/A'}.
    Provide a comprehensive, structured cybersecurity report with:
    - **Threats & Vulnerabilities:** List specific threats based solely on VirusTotal data (e.g., malware, phishing) or state "No specific threats detected" if none found. Include general risks associated with the input type (e.g., indirect risks from search results for URLs).
    - **Reputation:** Assess trustworthiness based on the domain/source and VirusTotal results, providing a qualitative analysis.
    - **Context:** Describe the input’s purpose and potential risks based on its nature (e.g., search query, website, file).
    - **Safety Tips:** Provide 5+ actionable, specific tips to mitigate risks, tailored to the input type.
    - **JSON Pie Chart:** Use these exact values based on VirusTotal: {"Safe": ${safePercentage}, "Malicious": ${maliciousPercentage}, "Suspicious": ${suspiciousPercentage}}. Do not alter these percentages; they must reflect the VirusTotal stats provided.
    Ensure detailed, clear, and actionable content for all sections, avoiding vague or incomplete responses.
  `;

  try {
    const geminiResult = await geminiModel.generateContent(prompt);
    const text = geminiResult.response.text();
    console.log(`Gemini Response for ${type}:`, text);
    return text || 'No analysis available from Gemini';
  } catch (error) {
    console.error(`Gemini Error for ${type}:`, error.message);
    const fallback = `
      **Cybersecurity Report for ${input}**
      - **Threats & Vulnerabilities:** ${vtStats.malicious > 0 ? 'Detected threats.' : 'No specific threats detected.'}
      - **Reputation:** ${vtFullData.reputation ? `Score: ${vtFullData.reputation}` : 'No data available.'}
      - **Context:** ${type === 'URL' ? 'Likely a website or service.' : 'Likely a file hash.'}
      - **Safety Tips:** Use HTTPS, run antivirus, enable 2FA, verify sources, avoid suspicious links.
      - **JSON Pie Chart:** {"Safe": ${safePercentage}, "Malicious": ${maliciousPercentage}, "Suspicious": ${suspiciousPercentage}}
    `;
    console.log(`Gemini Fallback for ${type}:`, fallback);
    return fallback;
  }
}

async function scanInput(input, type) {
  let vtStats = { malicious: 0, suspicious: 0, harmless: 0, undetected: 0, timeout: 0 };
  let vtFullData = { reputation: null, threat_names: [], categories: {} };
  const vtHeaders = { 'x-apikey': process.env.VIRUSTOTAL_API_KEY, 'Accept': 'application/json' };

  try {
    if (type === 'URL') {
      const encodedUrl = encodeURIComponent(input);
      const urlId = Buffer.from(encodedUrl).toString('base64').replace(/=/g, '');
      console.log('Processing URL:', input, 'Encoded URL:', encodedUrl, 'URL ID:', urlId);
      try {
        const vtResponse = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, { headers: vtHeaders });
        vtStats = vtResponse.data.data.attributes.last_analysis_stats;
        vtFullData = vtResponse.data.data.attributes;
      } catch (getError) {
        console.log('URL GET failed, trying POST:', getError.message);
        const vtPostResponse = await axios.post('https://www.virustotal.com/api/v3/urls', `url=${encodedUrl}`, {
          headers: { ...vtHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const analysisId = vtPostResponse.data.data.id;
        console.log('URL POST submitted, Analysis ID:', analysisId);
        for (let i = 0; i < 5; i++) {
          await new Promise(r => setTimeout(r, 2000));
          const analysis = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, { headers: vtHeaders });
          console.log(`Analysis attempt ${i + 1}:`, analysis.data.data.attributes.status);
          if (analysis.data.data.attributes.status === 'completed') {
            vtStats = analysis.data.data.attributes.stats;
            vtFullData = analysis.data.data.attributes;
            console.log('VirusTotal URL Analysis Complete:', vtStats);
            break;
          }
          if (i === 4) throw new Error('URL analysis timed out');
        }
      }
    } else if (type === 'Hash') {
      console.log('Processing Hash:', input);
      const vtResponse = await axios.get(`https://www.virustotal.com/api/v3/files/${input}`, { headers: vtHeaders });
      vtStats = vtResponse.data.data.attributes.last_analysis_stats;
      vtFullData = vtResponse.data.data.attributes;
    } else if (type === 'Domain') {
      console.log('Processing Domain:', input);
      const vtResponse = await axios.get(`https://www.virustotal.com/api/v3/domains/${input}`, { headers: vtHeaders });
      vtStats = vtResponse.data.data.attributes.last_analysis_stats;
      vtFullData = vtResponse.data.data.attributes;
    } else if (type === 'IP Address') {
      console.log('Processing IP:', input);
      const vtResponse = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${input}`, { headers: vtHeaders });
      vtStats = vtResponse.data.data.attributes.last_analysis_stats;
      vtFullData = vtResponse.data.data.attributes;
    }

    const total = (vtStats.harmless + vtStats.undetected + vtStats.malicious + vtStats.suspicious + vtStats.timeout) || 1;
    const maliciousPercentage = (vtStats.malicious / total) * 100;
    const suspiciousPercentage = (vtStats.suspicious / total) * 100;
    const isSafe = (maliciousPercentage + suspiciousPercentage) < 5;

    const safetyScoreBase = (vtStats.harmless + vtStats.undetected) / total * 100;
    const penalty = (vtStats.malicious * 10) + (vtStats.suspicious * 5);
    const safetyScore = Math.max(0, Math.round(safetyScoreBase - penalty));

    const geminiData = await fetchGeminiData(type, input, vtStats, vtFullData);

    const result = {
      isSafe,
      safetyScore,
      vtStats,
      vtFullData,
      geminiInsights: geminiData,
      inputType: type.toLowerCase()
    };
    console.log(`Returning analysis for ${input}:`, result);
    return result;
  } catch (error) {
    console.error('Scan Error:', error.message);
    return {
      error: `Scan failed: ${error.message || 'Internal server error'}`,
      isSafe: false,
      safetyScore: 0,
      vtStats: {},
      vtFullData: {},
      geminiInsights: 'Analysis unavailable due to server error',
      inputType: type.toLowerCase()
    };
  }
}

// Updated /api/scan endpoint with input validation
app.get(
  '/api/scan',
  validateInput([
    query('input')
      .notEmpty().withMessage('Input is required')
      .trim()
      .escape()
      .isLength({ max: 2000 }).withMessage('Input exceeds maximum length'),
  ]),
  async (req, res, next) => {
    const { input } = req.query;
    console.log('Received scan request for:', input);

    try {
      let type;
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?(\?.*)?$/;
      if (urlPattern.test(input)) type = 'URL';
      else if (/^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(input)) type = 'Hash';
      else if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(input)) type = 'Domain';
      else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(input)) type = 'IP Address';
      else {
        return res.status(400).json({ error: 'Invalid input type. Please provide a valid URL, domain, hash, or IP address.' });
      }

      const result = await scanInput(input, type);
      
      // Store scan result in database with improved error handling
      let recordId = null;
      try {
        const { data, error } = await supabase.from('scan_insights').insert([
          {
            input,
            type,
            is_safe: result.isSafe,
            safety_score: result.safetyScore,
            vt_stats: result.vtStats,
            vt_full_data: result.vtFullData,
            gemini_insights: result.geminiInsights,
          },
        ]).select();
        
        if (error) throw error;
        recordId = data[0].id;
        console.log('Scan completed, record ID:', recordId);
      } catch (supabaseError) {
        console.error('Supabase Insert Error:', supabaseError.message);
        // Continue sending the response despite DB failure
      }

      result.recordId = recordId;
      res.json(result);
    } catch (error) {
      next(error); // Pass to error handling middleware
    }
  }
);

app.post('/api/scan-file', upload.single('file'), async (req, res, next) => {
  const file = req.file;
  
  // Validate file
  if (!file || file.size === 0) {
    return res.status(400).json({ error: 'Valid file is required' });
  }
  
  // Check file size
  const maxSize = process.env.MAX_FILE_SIZE || 50 * 1024 * 1024; // Default 50MB
  if (file.size > maxSize) {
    return res.status(413).json({ error: `File exceeds maximum size of ${maxSize / (1024 * 1024)}MB` });
  }

  console.log('Received file scan request, file name:', file.originalname, 'file size:', file.size, 'bytes');

  let vtStats = { malicious: 0, suspicious: 0, harmless: 0, undetected: 0, timeout: 0 };
  let vtFullData = { reputation: null, threat_names: [], categories: {} };

  try {
    // Set a longer timeout for file analysis
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const vtHeaders = {
      'x-apikey': process.env.VIRUSTOTAL_API_KEY,
      ...formData.getHeaders(),
    };
    console.log('Sending file to VirusTotal with headers:', vtHeaders);
    const vtResponse = await axios.post('https://www.virustotal.com/api/v3/files', formData, { headers: vtHeaders });
    const analysisId = vtResponse.data.data.id;
    console.log('File POST submitted, Analysis ID:', analysisId);

    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const analysis = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, { headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY } });
      console.log(`File analysis attempt ${i + 1}:`, analysis.data.data.attributes.status);
      if (analysis.data.data.attributes.status === 'completed') {
        vtStats = analysis.data.data.attributes.stats;
        vtFullData = analysis.data.data.attributes;
        console.log('VirusTotal File Analysis Complete:', vtStats);
        break;
      }
      if (i === 29) {
        console.log('File analysis timed out after 90 seconds');
        return res.status(202).json({
          message: 'File scan queued, analysis still in progress after 90 seconds',
          analysisId,
          isSafe: null,
          safetyScore: null,
          vtStats: null,
          vtFullData: null,
          geminiInsights: 'Analysis pending',
          inputType: 'file'
        });
      }
    }

    const total = (vtStats.harmless + vtStats.undetected + vtStats.malicious + vtStats.suspicious + vtStats.timeout) || 1;
    const maliciousPercentage = (vtStats.malicious / total) * 100;
    const suspiciousPercentage = (vtStats.suspicious / total) * 100;
    const isSafe = (maliciousPercentage + suspiciousPercentage) < 5;
    const safetyScoreBase = (vtStats.harmless + vtStats.undetected) / total * 100;
    const penalty = (vtStats.malicious * 10) + (vtStats.suspicious * 5);
    const safetyScore = Math.max(0, Math.round(safetyScoreBase - penalty));

    const geminiData = await fetchGeminiData('File', file.originalname, vtStats, vtFullData);

    const result = {
      isSafe,
      safetyScore,
      vtStats,
      vtFullData,
      geminiInsights: geminiData,
      inputType: 'file'
    };
    console.log('File scan completed:', result);

    let recordId = null;
    try {
      const { data, error } = await supabase.from('file_insights').insert([{
        filename: file.originalname,
        is_safe: result.isSafe,
        safety_score: result.safetyScore,
        vt_stats: result.vtStats,
        vt_full_data: result.vtFullData,
        gemini_insights: result.geminiInsights
      }]).select();
      if (error) throw error;
      recordId = data[0].id;
      console.log('File scan recorded, record ID:', recordId);
    } catch (supabaseError) {
      console.error('Supabase Insert Error:', supabaseError.message);
    }

    result.recordId = recordId;
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/insights', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scan_insights')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Insights Fetch Error:', error.message);
    res.status(500).json({ error: `Failed to fetch insights: ${error.message}` });
  }
});

// Add a new endpoint to fetch cybersecurity news
app.get('/api/news', async (req, res) => {
  const API_KEY = process.env.NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`;

  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Add a new endpoint to handle Gemini API requests
app.post('/api/gemini', async (req, res) => {
  const { content } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: content }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    res.status(500).json({ error: 'Failed to process Gemini API request' });
  }
});

// Improved error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  // Avoid leaking sensitive details
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';
  
  res.status(statusCode).json({ 
    error: message,
    status: 'error',
    code: statusCode
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));