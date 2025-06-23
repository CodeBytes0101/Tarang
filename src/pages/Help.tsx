import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, Users } from 'lucide-react';
import HelpRequestForm from '../components/Help/HelpRequestForm';
import HelpRequestList from '../components/Help/HelpRequestList';
import { HelpRequest } from '../types';
import { dataService } from '../services/dataService';

interface HelpProps {
  lowPowerMode: boolean;
}

const Help: React.FC<HelpProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'list' | 'need' | 'offer'>('list');
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<HelpRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'need' | 'offer'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHelpRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [helpRequests, filter]);

  const loadHelpRequests = async () => {
    try {
      const requests = await dataService.getHelpRequests();
      setHelpRequests(requests.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading help requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...helpRequests];
    
    if (filter !== 'all') {
      filtered = filtered.filter(request => request.type === filter);
    }
    
    setFilteredRequests(filtered);
  };

  const handleNewRequest = (request: HelpRequest) => {
    setHelpRequests(prev => [request, ...prev]);
    setActiveTab('list');
  };

  const tabs = [
    { key: 'list' as const, label: 'Community Help', icon: Users },
    { key: 'need' as const, label: t('help.need'), icon: Plus },
    { key: 'offer' as const, label: t('help.offer'), icon: Plus }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Requests' },
    { value: 'need', label: 'Need Help' },
    { value: 'offer', label: 'Offering Help' }
  ];

  return (
    <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('help.title')}
          </h1>
          <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect with your community for mutual support during emergencies
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-2`}>
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : lowPowerMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
              <div className="flex items-center space-x-4">
                <Filter className={`w-5 h-5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex space-x-2">
                  {filterOptions.map((option) => (
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
            </div>

            <HelpRequestList 
              requests={filteredRequests} 
              loading={loading} 
              lowPowerMode={lowPowerMode} 
            />
          </div>
        )}

        {activeTab === 'need' && (
          <HelpRequestForm 
            type="need" 
            onSubmit={handleNewRequest} 
            lowPowerMode={lowPowerMode} 
          />
        )}

        {activeTab === 'offer' && (
          <HelpRequestForm 
            type="offer" 
            onSubmit={handleNewRequest} 
            lowPowerMode={lowPowerMode} 
          />
        )}
      </div>
    </div>
  );
};

export default Help;