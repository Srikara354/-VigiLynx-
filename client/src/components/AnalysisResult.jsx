import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Link, Shield, FileText, Code, Lock } from 'lucide-react';
import { useState, memo } from 'react';
import { cn, getSeverityColor, formatDate, sanitizeContent } from '../lib/utils';
import zxcvbn from 'zxcvbn';

const AnalysisResult = memo(function AnalysisResult({ result }) {
  const [expandedSection, setExpandedSection] = useState('summary');

  const getRiskIndicator = (score) => {
    const color = getSeverityColor(score);
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${color === 'danger' ? 'bg-danger' : color === 'warning' ? 'bg-warning' : 'bg-success'}`}></div>
        <span className={`${color === 'danger' ? 'text-danger' : color === 'warning' ? 'text-warning' : 'text-success'} font-medium`}>
          {score >= 7 ? 'High' : score >= 4 ? 'Medium' : 'Low'} Risk
        </span>
      </div>
    );
  };
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderResultIcon = () => {
    const score = result.risk_score || 0;
    if (score >= 7) {
      return <AlertCircle size={24} className="text-danger" />;
    } else if (score >= 4) {
      return <AlertTriangle size={24} className="text-warning" />;
    } else {
      return <CheckCircle size={24} className="text-success" />;
    }
  };

  const renderDetailItem = (label, value, icon = null) => (
    <div className="flex items-start gap-2 py-2 border-b border-border last:border-0">
      <div className="w-36 text-sm font-medium text-muted-foreground flex items-center gap-1">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </div>
      <div className="flex-1 text-sm">{value || 'N/A'}</div>
    </div>
  );

  const renderThreatsList = () => {
    if (!result.threats || result.threats.length === 0) {
      return (
        <div className="text-center p-4 bg-secondary/30 rounded-lg">
          <CheckCircle className="mx-auto mb-2 text-success" size={24} />
          <p className="text-muted-foreground">No threats detected</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {result.threats.map((threat, index) => (
          <div 
            key={index}
            className="p-3 border border-danger/20 rounded-lg bg-danger/5 transition-all-normal hover:shadow-hover"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-danger shrink-0" />
                <h4 className="font-medium">{threat.name}</h4>
              </div>
              <span className="badge badge-danger">{threat.category}</span>
            </div>
            {threat.description && (
              <p className="mt-2 text-sm text-muted-foreground">{threat.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPasswordStrength = (password) => {
    if (!password) return null;
    
    const strength = zxcvbn(password);
    const score = strength.score; // 0-4 (0 = very weak, 4 = very strong)
    
    const getStrengthLabel = (score) => {
      switch(score) {
        case 0: return 'Very Weak';
        case 1: return 'Weak';
        case 2: return 'Fair';
        case 3: return 'Good';
        case 4: return 'Strong';
        default: return 'Unknown';
      }
    };
    
    const getStrengthColor = (score) => {
      switch(score) {
        case 0: 
        case 1: return 'text-danger bg-danger/10 border-danger/20';
        case 2: return 'text-warning bg-warning/10 border-warning/20';
        case 3: 
        case 4: return 'text-success bg-success/10 border-success/20';
        default: return 'text-muted-foreground bg-secondary/30 border-border';
      }
    };
    
    const strengthLabel = getStrengthLabel(score);
    const strengthColor = getStrengthColor(score);
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Password Strength</span>
            <span className={`text-sm px-2 py-0.5 rounded-full ${strengthColor}`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(score + 1) * 20}%` }}
              transition={{ duration: 0.8, type: "spring" }}
              className={`h-full ${score <= 1 ? 'bg-danger' : score === 2 ? 'bg-warning' : 'bg-success'}`}
            />
          </div>
        </div>
        
        {strength.feedback.warning && (
          <div className="p-3 border rounded-lg bg-warning/5 border-warning/20">
            <p className="text-sm font-medium text-warning flex items-center gap-1">
              <AlertTriangle size={16} /> Warning
            </p>
            <p className="text-sm mt-1">{strength.feedback.warning}</p>
          </div>
        )}
        
        {strength.feedback.suggestions.length > 0 && (
          <div className="p-3 border rounded-lg bg-info/5 border-info/20">
            <p className="text-sm font-medium text-info flex items-center gap-1">
              <Info size={16} /> Suggestions
            </p>
            <ul className="mt-1 text-sm space-y-1 list-disc pl-5">
              {strength.feedback.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="p-3 border rounded-lg bg-secondary/20 border-border">
          <p className="text-sm font-medium mb-2">Password Details</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Estimated guesses: </span>
              <span className="font-mono">{strength.guesses.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Crack time: </span>
              <span className="font-mono">{strength.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderPasswordSection = () => {
    if (!result.password) return null;
    
    return (
      <div className="space-y-4">
        {renderPasswordStrength(result.password)}
        
        {result.is_breached !== undefined && (
          <div className={`p-4 border rounded-lg ${result.is_breached ? 
            'bg-danger/5 border-danger/20' : 
            'bg-success/5 border-success/20'}`}>
            <div className="flex items-center gap-2">
              {result.is_breached ? (
                <AlertCircle size={18} className="text-danger" />
              ) : (
                <CheckCircle size={18} className="text-success" />
              )}
              <span className="font-medium">
                {result.is_breached ? 
                  'Password found in data breaches' : 
                  'Password not found in known data breaches'}
              </span>
            </div>
            <p className="mt-2 text-sm">
              {result.is_breached ? 
                'This password has been exposed in data breaches. We strongly recommend changing it to a secure, unique password immediately.' : 
                'Good news! This password hasn\'t been found in known data breaches. However, always ensure you use unique passwords for different accounts.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCollapsibleSection = (id, title, icon, content) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border border-border rounded-lg overflow-hidden mb-4 transition-all-normal">
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between p-4 text-left transition-all-normal ${
            isExpanded ? 'bg-secondary/30' : 'hover:bg-secondary/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-card">{content}</div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-gradient"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {renderResultIcon()}
            <h2 className="text-xl font-semibold">Analysis Results</h2>
          </div>
          
          <div className="status-badge status-badge-info">
            <Info size={14} className="mr-1" /> 
            <span>Report ID: #{result.scan_id?.substring(0, 8) || 'N/A'}</span>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card card-compact bg-secondary/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Score</span>
              {getRiskIndicator(result.risk_score || 0)}
            </div>
            <div className="mt-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, (result.risk_score || 0) * 10))}%` }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className={`h-full ${getSeverityColor(result.risk_score || 0) === 'danger' ? 'bg-danger' : getSeverityColor(result.risk_score || 0) === 'warning' ? 'bg-warning' : 'bg-success'}`}
                />
              </div>
              <div className="mt-1 text-2xl font-bold">{result.risk_score || 0}/10</div>
            </div>
          </div>
          
          <div className="card card-compact bg-secondary/30">
            <div className="text-sm font-medium mb-1">Analysis Type</div>
            <div className="flex items-center gap-2">
              {result.input_type === 'file' ? (
                <FileText size={18} className="text-primary" />
              ) : (
                <Link size={18} className="text-primary" />
              )}
              <span className="font-medium capitalize">{result.input_type || 'URL'} Analysis</span>
            </div>
          </div>
          
          <div className="card card-compact bg-secondary/30">
            <div className="text-sm font-medium mb-1">Detection Status</div>
            <div className="flex items-center gap-2">
              <Shield size={18} className={`${getSeverityColor(result.risk_score || 0) === 'danger' ? 'text-danger' : getSeverityColor(result.risk_score || 0) === 'warning' ? 'text-warning' : 'text-success'}`} />
              <span className="font-medium">
                {result.threats?.length ? `${result.threats.length} Threats Detected` : 'No Threats Detected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {renderCollapsibleSection(
        'summary',
        'Summary',
        <Info size={20} className="text-info" />,
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none dark:prose-invert" 
               dangerouslySetInnerHTML={{ __html: sanitizeContent(result.summary || 'The analysis did not provide a summary for this scan.') }} />
          
          {result.recommendation && (
            <div className="p-3 bg-info/10 rounded-lg border border-info/20">
              <div className="font-medium text-info flex items-center gap-1 mb-1">
                <Shield size={16} /> Recommendation
              </div>
              <p className="text-sm">{sanitizeContent(result.recommendation)}</p>
            </div>
          )}
        </div>
      )}
      
      {renderCollapsibleSection(
        'details',
        'Analysis Details',
        <Code size={20} className="text-primary" />,
        <div className="space-y-2">
          {renderDetailItem('Target', result.target, <Link size={16} />)}
          {renderDetailItem('Type', result.input_type, <Info size={16} />)}
          {renderDetailItem('Scan Date', formatDate(result.timestamp || Date.now()), <Info size={16} />)}
          {result.file_name && renderDetailItem('File Name', result.file_name, <FileText size={16} />)}
          {result.file_type && renderDetailItem('File Type', result.file_type, <FileText size={16} />)}
          {result.file_size && renderDetailItem('File Size', `${(result.file_size / 1024).toFixed(2)} KB`, <FileText size={16} />)}
        </div>
      )}
      
      {result.password && renderCollapsibleSection(
        'password',
        'Password Security',
        <Lock size={20} className="text-primary" />,
        renderPasswordSection()
      )}
      
      {renderCollapsibleSection(
        'threats',
        'Detected Threats',
        <AlertCircle size={20} className="text-danger" />,
        renderThreatsList()
      )}
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>Analysis completed on {formatDate(result.timestamp || Date.now())}</p>
      </div>
    </motion.div>
  );
});

export default AnalysisResult;