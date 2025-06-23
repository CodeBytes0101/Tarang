import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Shield, Flame, Heart, AlertTriangle } from 'lucide-react';
import { EmergencyContact } from '../../types';
import { dataService } from '../../services/dataService';

interface EmergencyContactsProps {
  lowPowerMode: boolean;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await dataService.getEmergencyContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'police': return Shield;
      case 'fire': return Flame;
      case 'medical': return Heart;
      case 'disaster': return AlertTriangle;
      default: return Phone;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'police': return 'text-blue-600';
      case 'fire': return 'text-red-600';
      case 'medical': return 'text-green-600';
      case 'disaster': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6`}>
        <div className={`h-4 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-16 ${lowPowerMode ? 'bg-gray-800' : 'bg-gray-200'} rounded`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className={`text-xl font-bold mb-4 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
        {t('emergency.contacts')}
      </h2>
      
      <div className="grid gap-3">
        {contacts.map((contact) => {
          const Icon = getIcon(contact.type);
          const iconColor = getIconColor(contact.type);
          
          return (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                lowPowerMode
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  lowPowerMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                    {contact.name}
                  </h3>
                  <p className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contact.area}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => makeCall(contact.phone)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                aria-label={`Call ${contact.name}`}
              >
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </button>
            </div>
          );
        })}
      </div>
      
      <div className={`mt-6 p-4 rounded-lg ${
        lowPowerMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
      } border`}>
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${
            lowPowerMode ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <div>
            <h4 className={`font-semibold ${lowPowerMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
              Emergency Guidelines
            </h4>
            <p className={`text-sm mt-1 ${lowPowerMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              In case of immediate danger, call the appropriate emergency number. Stay calm and provide clear information about your location and situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;