'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PrintResult {
  carePriorityScore: 'High' | 'Medium' | 'Low';
  explanation: string;
  detectedIssues?: string[];
  routingInfo?: {
    partnerName: string;
    contactInfo: string;
    address: string;
    nextSteps: string[];
  };
}

interface PrintResultsPageProps {
  result: PrintResult;
  mlData?: any;
  title?: string;
  subtitle?: string;
  patientCode?: string;
  scanType?: 'dental' | 'gym' | 'general';
}

const PrintResultsPage: React.FC<PrintResultsPageProps> = ({
  result,
  mlData,
  title = "Health Screening Results",
  subtitle = "AI-Powered Analysis Report",
  patientCode,
  scanType = 'general'
}) => {
  
  const getPriorityConfig = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return {
          icon: AlertCircle,
          color: '#ef4444',
          bgColor: '#fee2e2',
          textColor: '#991b1b',
          title: 'Attention Needed',
          message: 'We strongly recommend scheduling an evaluation as soon as possible.'
        };
      case 'Medium':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          textColor: '#92400e',
          title: 'Evaluation Recommended',
          message: 'You may benefit from a professional evaluation.'
        };
      case 'Low':
        return {
          icon: CheckCircle,
          color: '#10b981',
          bgColor: '#d1fae5',
          textColor: '#065f46',
          title: 'Looking Good',
          message: 'Continue your regular care routine and preventive visits.'
        };
      default:
        return {
          icon: Clock,
          color: '#6b7280',
          bgColor: '#f3f4f6',
          textColor: '#374151',
          title: 'Assessment Complete',
          message: 'Professional evaluation recommended for detailed assessment.'
        };
    }
  };

  const priorityConfig = getPriorityConfig(result.carePriorityScore);
  const IconComponent = priorityConfig.icon;

  return (
    <div className="print-layout bg-white min-h-screen p-6 max-w-full">
      {/* Print Header */}
      <div className="print-header text-center mb-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Health Screening Results</h1>
        <p className="text-base text-gray-600 mb-3">AI-Powered Analysis Report</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div><strong>Generated:</strong> {new Date().toLocaleDateString()}</div>
          {patientCode && <div><strong>Patient Code:</strong> <span className="patient-code font-mono">{patientCode}</span></div>}
          <div><strong>Type:</strong> {scanType.charAt(0).toUpperCase() + scanType.slice(1)} Screening</div>
        </div>
      </div>

      {/* Priority Assessment */}
      <div className={`print-card priority-card mb-4 p-4 rounded-lg status-${result.carePriorityScore.toLowerCase()}`} style={{ 
        backgroundColor: priorityConfig.bgColor 
      }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: priorityConfig.color }}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: priorityConfig.textColor }}>
              {priorityConfig.title}
            </h2>
            <p className="text-sm" style={{ color: priorityConfig.textColor }}>
              Priority: {result.carePriorityScore}
            </p>
          </div>
        </div>
        <p className="text-sm" style={{ color: priorityConfig.textColor }}>
          {priorityConfig.message}
        </p>
      </div>

      {/* Assessment Summary */}
      <div className="print-card assessment-card mb-4 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📋</span>
          Assessment Summary
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3 text-sm">
          {result.explanation}
        </p>
        
        {result.detectedIssues && result.detectedIssues.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="font-semibold text-gray-900 mb-2 text-sm">Areas Noted:</p>
            <ul className="space-y-1">
              {result.detectedIssues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed ML Analysis */}
      {mlData && (
        <div className="print-card mb-6 p-6 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            Detailed Analysis Results
          </h3>
          
          {/* Overall Assessment */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">Overall Assessment</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Priority Level:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {mlData?.triage_status || mlData?.overall_status || 'Medium'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Quality Score:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {mlData?.quality_score ? `${(mlData.quality_score * 100).toFixed(0)}%` : 
                   mlData?.quality?.score ? `${(mlData.quality.score * 100).toFixed(0)}%` : '80%'}
                </span>
              </div>
            </div>
          </div>

          {/* All Findings with Confidence Scores */}
          {mlData?.findings && mlData.findings.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Detailed Findings</h4>
              <div className="space-y-3">
                {mlData.findings.map((finding: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {finding.type || finding.name || `Finding ${index + 1}`}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        finding.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                        finding.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {(finding.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    {finding.description && (
                      <p className="text-gray-700 text-sm">{finding.description}</p>
                    )}
                    {finding.location && (
                      <p className="text-gray-600 text-xs mt-1">Location: {finding.location}</p>
                    )}
                    {finding.severity && (
                      <p className="text-gray-600 text-xs mt-1">Severity: {finding.severity}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {mlData?.recommendations && mlData.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">AI Recommendations</h4>
              <ul className="space-y-2">
                {mlData.recommendations.map((rec: any, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1 text-xs">▶</span>
                    <span className="text-sm">
                      {typeof rec === 'string' ? rec : rec.text || rec.description || rec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Community Health Partner */}
      {result.routingInfo && (
        <div className="print-card partner-card mb-4 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
            <span className="text-xl">🏥</span>
            Your Community Health Partner
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Contact Information</h4>
              <div className="space-y-1 text-gray-700 text-xs">
                <p className="font-medium">{result.routingInfo.partnerName || 'Community Health Center'}</p>
                <p className="flex items-center gap-1">
                  <span className="text-blue-600">📞</span>
                  {result.routingInfo.contactInfo || '(555) 123-HEALTH'}
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-blue-600">📍</span>
                  {result.routingInfo.address || 'Your Local Area'}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Recommended Next Steps</h4>
              <ol className="space-y-1 text-gray-700 text-xs">
                {(result.routingInfo.nextSteps || [
                  'Contact for professional consultation',
                  'Bring this screening result', 
                  'Follow recommended care plan'
                ]).slice(0, 3).map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Important Notice */}
      <div className="print-card notice-card p-4 rounded-lg bg-orange-50">
        <h3 className="text-base font-bold text-orange-800 mb-2 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          Important Notice
        </h3>
        <div className="text-orange-800 text-xs space-y-1">
          <p>
            <strong>This is a screening tool only.</strong> Results are generated by AI and should not be considered a medical diagnosis.
          </p>
          <p>
            Always consult with a qualified healthcare professional for proper medical evaluation and treatment.
          </p>
        </div>
      </div>

      {/* Technical Information */}
      <div className="mt-6 pt-3 text-xs text-gray-500">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p><strong>Method:</strong> AI Health Screening</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <div>
            {mlData?.model_version && (
              <p><strong>Version:</strong> {mlData.model_version}</p>
            )}
            {mlData?.analysis_id && (
              <p><strong>ID:</strong> {mlData.analysis_id?.slice(-8) || 'N/A'}</p>
            )}
          </div>
          <div>
            <p><strong>Type:</strong> Health Report</p>
            <p><strong>By:</strong> ReplyQuick AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintResultsPage;