import React from 'react';
import { useTranslation } from 'react-i18next';
import EmergencyContacts from '../components/Emergency/EmergencyContacts';
import SafetyTips from '../components/Emergency/SafetyTips';

interface EmergencyProps {
  lowPowerMode: boolean;
}

const Emergency: React.FC<EmergencyProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('emergency.title')}
          </h1>
          <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Quick access to emergency services and safety information
          </p>
        </div>

        <EmergencyContacts lowPowerMode={lowPowerMode} />
        <SafetyTips lowPowerMode={lowPowerMode} />
      </div>
    </div>
  );
};

export default Emergency;