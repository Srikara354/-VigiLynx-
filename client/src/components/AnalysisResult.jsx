import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Link, Shield, FileText, Code } from 'lucide-react';
import { useState, memo } from 'react';
import { cn, getSeverityColor, formatDate, sanitizeContent } from '../lib/utils';

const AnalysisResult = memo(function AnalysisResult({ result }) {
  const [expandedSection, setExpandedSection] = useState('summary');

  const getRiskIndicator = (score) => {
    const color = getSeverityColor(score);
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full bg-${color}`}></div>
        <span className={`text-${color} font-medium`}>
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
                  className={cn(
                    "h-full", 
                    `bg-${getSeverityColor(result.risk_score || 0)}`
                  )}
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
              <Shield size={18} className={cn(`text-${getSeverityColor(result.risk_score || 0)}`)} />
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