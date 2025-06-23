import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Filter,
  RefreshCw,
  TrendingUp,
  Shield
} from 'lucide-react';
import { EmergencyAlert, AlertVerificationResult } from '../../types';
import AlertVerificationPanel from './AlertVerificationPanel';
import MisinformationReporter from './MisinformationReporter';
import { dataService } from '../../services/dataService';

interface AlertFeedProps {
  lowPowerMode: boolean;
}

const AlertFeed: React.FC<AlertFeedProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [verificationResults, setVerificationResults] = useState<{ [key: string]: AlertVerificationResult }>({});
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alertsData = await dataService.getEmergencyAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAlerts = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const handleVerificationComplete = (result: AlertVerificationResult) => {
    setVerificationResults(prev => ({
      ...prev,
      [result.alertId]: result
    }));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    const result = verificationResults[alert.id];
    if (!result) return filter === 'unverified';
    return filter === 'verified' ? result.isVerified : !result.isVerified;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-48 ${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
              Emergency Alert Feed
            </h1>
            <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-verified emergency alerts and community reports
            </p>
          </div>
          <button
            onClick={refreshAlerts}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className={`w-5 h-5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All Alerts' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'unverified', label: 'Unverified' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-blue-600 text-white'
                        : lowPowerMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredAlerts.length} alerts</span>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div className="space-y-6">
          {filteredAlerts.length === 0 ? (
            <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
              <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${lowPowerMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                No alerts found
              </h3>
              <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filter === 'all' 
                  ? 'No emergency alerts available at the moment.'
                  : `No ${filter} alerts found. Try changing the filter.`
                }
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="space-y-4">
                {/* Alert Card */}
                <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-6 h-6 mt-1 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.category === 'earthquake' ? 'bg-orange-100 text-orange-800' :
                            alert.category === 'flood' ? 'bg-blue-100 text-blue-800' :
                            alert.category === 'fire' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.category}
                          </span>
                        </div>
                        <h3 className={`text-lg font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                          {alert.content.substring(0, 100)}...
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(alert.timestamp)}</span>
                      </div>
                      {verificationResults[alert.id] && (
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-500">AI Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alert Content */}
                  <p className={`mb-4 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {alert.content}
                  </p>

                  {/* Location and Source */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className={`w-4 h-4 ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {alert.location.address}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Source:
                      </span>
                      <span className={`text-sm font-medium ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {alert.source.name}
                      </span>
                      {alert.source.verified && (
                        <Shield className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <MisinformationReporter 
                        alertId={alert.id} 
                        lowPowerMode={lowPowerMode}
                      />
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Alert ID: {alert.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>

                {/* AI Verification Panel */}
                <AlertVerificationPanel
                  alert={alert}
                  lowPowerMode={lowPowerMode}
                  onVerificationComplete={handleVerificationComplete}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertFeed;