import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, AlertTriangle, Droplets, Flame, Wind } from 'lucide-react';
import { SafetyTip } from '../../types';
import { dataService } from '../../services/dataService';

interface SafetyTipsProps {
  lowPowerMode: boolean;
}

const SafetyTips: React.FC<SafetyTipsProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSafetyTips();
  }, []);

  const loadSafetyTips = async () => {
    try {
      const tips = await dataService.getSafetyTips();
      setSafetyTips(tips);
    } catch (error) {
      console.error('Error loading safety tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Tips', icon: BookOpen },
    { value: 'earthquake', label: 'Earthquake', icon: AlertTriangle },
    { value: 'flood', label: 'Flood', icon: Droplets },
    { value: 'fire', label: 'Fire', icon: Flame },
    { value: 'cyclone', label: 'Cyclone', icon: Wind },
    { value: 'general', label: 'General', icon: BookOpen }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? safetyTips 
    : safetyTips.filter(tip => tip.category === selectedCategory);

  const getIconForCategory = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  if (loading) {
    return (
      <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="animate-pulse">
          <div className={`h-6 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-20 ${lowPowerMode ? 'bg-gray-800' : 'bg-gray-200'} rounded`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className={`text-xl font-bold mb-4 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
        {t('emergency.tips')}
      </h2>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : lowPowerMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="space-y-4">
        {filteredTips.length === 0 ? (
          <div className={`text-center py-8 ${lowPowerMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No safety tips found for this category.</p>
          </div>
        ) : (
          filteredTips.map((tip) => {
            const Icon = getIconForCategory(tip.category);
            return (
              <div
                key={tip.id}
                className={`p-4 rounded-lg border transition-colors ${
                  lowPowerMode
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    tip.category === 'earthquake' ? 'bg-orange-100 text-orange-600' :
                    tip.category === 'flood' ? 'bg-blue-100 text-blue-600' :
                    tip.category === 'fire' ? 'bg-red-100 text-red-600' :
                    tip.category === 'cyclone' ? 'bg-gray-100 text-gray-600' :
                    'bg-green-100 text-green-600'
                  } ${lowPowerMode ? 'bg-opacity-20' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                      {tip.title}
                    </h3>
                    <p className={`${lowPowerMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {tip.content}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        tip.category === 'earthquake' ? 'bg-orange-100 text-orange-800' :
                        tip.category === 'flood' ? 'bg-blue-100 text-blue-800' :
                        tip.category === 'fire' ? 'bg-red-100 text-red-800' :
                        tip.category === 'cyclone' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      } ${lowPowerMode ? 'bg-opacity-20 text-opacity-80' : ''}`}>
                        {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Additional Resources */}
      <div className={`mt-6 p-4 rounded-lg ${
        lowPowerMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
      } border`}>
        <div className="flex items-start space-x-3">
          <BookOpen className={`w-5 h-5 mt-0.5 ${
            lowPowerMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <div>
            <h4 className={`font-semibold ${lowPowerMode ? 'text-blue-400' : 'text-blue-800'}`}>
              Emergency Preparedness
            </h4>
            <p className={`text-sm mt-1 ${lowPowerMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Always keep an emergency kit ready with essentials like water, food, first aid supplies, 
              flashlight, and important documents. Stay informed about local emergency procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyTips;