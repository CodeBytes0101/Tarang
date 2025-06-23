import React from 'react';
import { useTranslation } from 'react-i18next';
import EmergencyMap from '../components/Map/EmergencyMap';

interface MapProps {
  lowPowerMode: boolean;
}

const Map: React.FC<MapProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('map.title')}
          </h1>
          <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Find nearby emergency services, shelters, and relief centers
          </p>
        </div>

        <EmergencyMap lowPowerMode={lowPowerMode} />
      </div>
    </div>
  );
};

export default Map;