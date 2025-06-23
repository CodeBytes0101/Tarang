import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, HelpCircle, Map, Phone, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelpRequest } from '../types';
import { dataService } from '../services/dataService';
import { peerService } from '../services/peerService';

interface DashboardProps {
  lowPowerMode: boolean;
  isOnline: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ lowPowerMode, isOnline }) => {
  const { t } = useTranslation();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [nearbyDevices, setNearbyDevices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    scanForNearbyDevices();
  }, []);

  const loadDashboardData = async () => {
    try {
      const requests = await dataService.getHelpRequests();
      setHelpRequests(requests.slice(0, 5)); // Show only recent 5
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scanForNearbyDevices = async () => {
    try {
      const devices = await peerService.scanForNearbyDevices();
      setNearbyDevices(devices);
    } catch (error) {
      console.error('Error scanning for devices:', error);
    }
  };

  const sendEmergencyAlert = async () => {
    try {
      await peerService.broadcastEmergencyAlert(
        'Emergency alert from user',
        { lat: 28.6139, lng: 77.2090 }
      );
    } catch (error) {
      console.error('Error sending emergency alert:', error);
    }
  };

  const quickActions = [
    {
      title: t('navigation.emergency'),
      icon: AlertTriangle,
      path: '/emergency',
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Access emergency contacts and services'
    },
    {
      title: t('navigation.help'),
      icon: HelpCircle,
      path: '/help',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Request or offer community help'
    },
    {
      title: t('navigation.map'),
      icon: Map,
      path: '/map',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Find nearby emergency services'
    }
  ];

  const stats = [
    {
      label: 'Active Help Requests',
      value: helpRequests.filter(r => r.status === 'active').length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Nearby Devices',
      value: nearbyDevices.length,
      icon: Shield,
      color: 'text-green-600'
    },
    {
      label: 'Connection Status',
      value: isOnline ? 'Online' : 'Offline',
      icon: Zap,
      color: isOnline ? 'text-green-600' : 'text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <div className="animate-pulse space-y-6">
          <div className={`h-8 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-32 ${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-3xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
            {t('app.name')}
          </h1>
          <p className={`text-lg ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('app.tagline')}
          </p>
        </div>

        {/* Emergency Alert Button */}
        <div className="text-center">
          <button
            onClick={sendEmergencyAlert}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            <AlertTriangle className="w-6 h-6 inline mr-2" />
            EMERGENCY ALERT
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} text-white rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50`}
            >
              <div className="flex items-center space-x-4">
                <action.icon className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">{action.title}</h3>
                  <p className="text-sm opacity-90 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Help Requests */}
        {helpRequests.length > 0 && (
          <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Help Requests
            </h2>
            <div className="space-y-3">
              {helpRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 rounded-lg border ${
                    lowPowerMode
                      ? 'border-gray-700 bg-gray-700'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          request.type === 'need'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.type === 'need' ? 'Need Help' : 'Offering Help'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          request.priority === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : request.priority === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : request.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                          {request.priority}
                        </span>
                      </div>
                      <h3 className={`font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                        {request.category}
                      </h3>
                      <p className={`text-sm ${lowPowerMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                        {request.description.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(request.timestamp).toLocaleDateString()}
                      </p>
                      {!request.synced && (
                        <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-1"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/help"
                className={`text-sm font-medium ${lowPowerMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                View All Help Requests →
              </Link>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className={`${lowPowerMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-6`}>
          <h3 className={`font-bold text-lg mb-2 ${lowPowerMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
            Safety Reminder
          </h3>
          <p className={`${lowPowerMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
            Stay connected with your community. In case of emergency, remain calm and seek help from trusted sources. 
            Keep your emergency contacts updated and your device charged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;