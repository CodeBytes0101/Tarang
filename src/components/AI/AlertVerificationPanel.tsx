import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag,
  TrendingUp,
  Eye,
  Brain
} from 'lucide-react';
import { EmergencyAlert, AlertVerificationResult } from '../../types';
import { aiAlertDetector } from '../../services/aiAlertDetector';

interface AlertVerificationPanelProps {
  alert: EmergencyAlert;
  lowPowerMode: boolean;
  onVerificationComplete?: (result: AlertVerificationResult) => void;
}

const AlertVerificationPanel: React.FC<AlertVerificationPanelProps> = ({ 
  alert, 
  lowPowerMode, 
  onVerificationComplete 
}) => {
  const { t } = useTranslation();
  const [verificationResult, setVerificationResult] = useState<AlertVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    verifyAlert();
  }, [alert]);

  const verifyAlert = async () => {
    setIsVerifying(true);
    try {
      const result = await aiAlertDetector.verifyAlert(alert);
      setVerificationResult(result);
      onVerificationComplete?.(result);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 border-green-200';
    if (score >= 0.6) return 'bg-yellow-100 border-yellow-200';
    if (score >= 0.4) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getFlagColor = (flag: string) => {
    const criticalFlags = ['SUSPICIOUS_CONTENT', 'UNRELIABLE_SOURCE', 'VERIFICATION_ERROR'];
    return criticalFlags.includes(flag) ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (isVerifying) {
    return (
      <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="flex items-center justify-center space-x-3">
          <Brain className={`w-6 h-6 animate-pulse ${lowPowerMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div className="text-center">
            <h3 className={`font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
              AI Verification in Progress
            </h3>
            <p className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Analyzing alert for authenticity and reliability...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationResult) {
    return null;
  }

  return (
    <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className={`w-6 h-6 ${lowPowerMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-lg font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
            AI Alert Verification
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {verificationResult.isVerified ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`text-sm font-medium ${
            verificationResult.isVerified ? 'text-green-600' : 'text-red-600'
          }`}>
            {verificationResult.isVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Trust Score */}
      <div className={`p-4 rounded-lg border ${getTrustScoreBg(verificationResult.trustScore.overall)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold ${getTrustScoreColor(verificationResult.trustScore.overall)}`}>
            Trust Score
          </span>
          <span className={`text-2xl font-bold ${getTrustScoreColor(verificationResult.trustScore.overall)}`}>
            {Math.round(verificationResult.trustScore.overall * 100)}%
          </span>
        </div>
        
        {/* Trust Score Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="text-center">
            <div className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>Content</div>
            <div className={getTrustScoreColor(verificationResult.trustScore.content)}>
              {Math.round(verificationResult.trustScore.content * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>Source</div>
            <div className={getTrustScoreColor(verificationResult.trustScore.source)}>
              {Math.round(verificationResult.trustScore.source * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</div>
            <div className={getTrustScoreColor(verificationResult.trustScore.location)}>
              {Math.round(verificationResult.trustScore.location * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>Timing</div>
            <div className={getTrustScoreColor(verificationResult.trustScore.temporal)}>
              {Math.round(verificationResult.trustScore.temporal * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>Cross-Ref</div>
            <div className={getTrustScoreColor(verificationResult.trustScore.crossReference)}>
              {Math.round(verificationResult.trustScore.crossReference * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Flags */}
      {verificationResult.flags.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Flag className={`w-4 h-4 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`font-medium ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
              Detected Issues
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {verificationResult.flags.map((flag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getFlagColor(flag)}`}
              >
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Reasoning */}
      <div className={`p-3 rounded-lg ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-start space-x-2">
          <Brain className={`w-4 h-4 mt-0.5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <div>
            <h4 className={`font-medium text-sm ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
              AI Analysis
            </h4>
            <p className={`text-sm mt-1 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {verificationResult.reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className={`font-medium text-sm mb-2 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
          Recommendations
        </h4>
        <ul className="space-y-1">
          {verificationResult.recommendations.map((recommendation, index) => (
            <li
              key={index}
              className={`text-sm flex items-start space-x-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <span className="text-blue-500 mt-1">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Processing Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Processed in {verificationResult.processingTime}ms</span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          <Eye className="w-3 h-3" />
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
        </button>
      </div>

      {/* Detailed Analysis */}
      {showDetails && (
        <div className={`mt-4 p-4 rounded-lg border ${lowPowerMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`font-medium mb-3 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
            Detailed Analysis
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Content Analysis:
              </span>
              <div className={`ml-4 mt-1 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div>Emergency Relevance: {Math.round(verificationResult.trustScore.breakdown.contentAnalysis?.emergencyRelevance * 100 || 0)}%</div>
                <div>Language Quality: {Math.round(verificationResult.trustScore.breakdown.contentAnalysis?.languageQuality * 100 || 0)}%</div>
                <div>Suspicious Patterns: {Math.round(verificationResult.trustScore.breakdown.contentAnalysis?.suspiciousPatterns * 100 || 0)}%</div>
              </div>
            </div>
            
            <div>
              <span className={`font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Source Verification:
              </span>
              <div className={`ml-4 mt-1 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div>Official Source: {verificationResult.trustScore.breakdown.sourceVerification?.isOfficial ? 'Yes' : 'No'}</div>
                <div>Historical Reliability: {Math.round(verificationResult.trustScore.breakdown.sourceVerification?.historicalReliability * 100 || 0)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertVerificationPanel;