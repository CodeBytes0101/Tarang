import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, User, Phone, AlertCircle } from 'lucide-react';
import { HelpRequest } from '../../types';

interface HelpRequestListProps {
  requests: HelpRequest[];
  loading: boolean;
  lowPowerMode: boolean;
}

const HelpRequestList: React.FC<HelpRequestListProps> = ({ requests, loading, lowPowerMode }) => {
  const { t } = useTranslation();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'need' 
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`p-4 rounded-lg ${lowPowerMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className={`h-4 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-2`}></div>
              <div className={`h-3 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-2`}></div>
              <div className={`h-3 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${lowPowerMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
          No help requests found
        </h3>
        <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Be the first to request or offer help in your community.
        </p>
      </div>
    );
  }

  return (
    <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className={`text-xl font-bold mb-4 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
        Help Requests ({requests.length})
      </h2>
      
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className={`p-4 rounded-lg border transition-colors ${
              lowPowerMode
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {/* Header with type and priority badges */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(request.type)}`}>
                  {request.type === 'need' ? 'Need Help' : 'Offering'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
                {!request.synced && (
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" title="Not synced"></span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(request.timestamp)}</span>
              </div>
            </div>

            {/* Category and Description */}
            <div className="mb-3">
              <h3 className={`font-semibold text-lg mb-1 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
              </h3>
              <p className={`${lowPowerMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {request.description}
              </p>
            </div>

            {/* Contact and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <User className={`w-4 h-4 ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-700'}>
                  {request.contactInfo.name}
                </span>
                {request.contactInfo.phone && (
                  <>
                    <Phone className={`w-4 h-4 ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <a
                      href={`tel:${request.contactInfo.phone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {request.contactInfo.phone}
                    </a>
                  </>
                )}
              </div>
              
              {request.location.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className={`w-4 h-4 ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`${lowPowerMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                    {request.location.address}
                  </span>
                </div>
              )}
            </div>

            {/* Status indicator */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  request.status === 'active' 
                    ? 'bg-green-500' 
                    : request.status === 'fulfilled' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-500'
                }`}></div>
                <span className={`text-xs font-medium ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              
              {request.contactInfo.phone && (
                <button
                  onClick={() => window.location.href = `tel:${request.contactInfo.phone}`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Contact
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpRequestList;