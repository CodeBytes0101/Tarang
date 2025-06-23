import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Globe, MapPin, Battery, Bell, Shield } from 'lucide-react';
import { UserPreferences } from '../types';
import { dataService } from '../services/dataService';

interface SettingsProps {
  lowPowerMode: boolean;
  onLowPowerModeChange: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ lowPowerMode, onLowPowerModeChange }) => {
  const { t, i18n } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await dataService.getUserPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await dataService.saveUserPreferences(preferences);
      // Apply language change
      i18n.changeLanguage(preferences.language);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;
    
    setPreferences(prev => prev ? { ...prev, [key]: value } : null);
    
    // Special handling for low power mode
    if (key === 'lowPowerMode') {
      onLowPowerModeChange(value);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updatePreference('location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (loading || !preferences) {
    return (
      <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className={`h-8 ${lowPowerMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
            <div className={`h-64 ${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('settings.title')}
          </h1>
          <p className={`${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Customize your Tarang experience
          </p>
        </div>

        {/* Settings Form */}
        <div className={`${lowPowerMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 space-y-6`}>
          {/* Language Settings */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Globe className={`w-5 h-5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.language')}
              </h3>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => updatePreference('language', e.target.value)}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                lowPowerMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Location Settings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <MapPin className={`w-5 h-5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('settings.location')}
                </h3>
              </div>
              <button
                onClick={getCurrentLocation}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Update Location
              </button>
            </div>
            <div className={`p-3 rounded-lg border ${
              lowPowerMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-sm ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Latitude: {preferences.location.lat.toFixed(4)}
              </p>
              <p className={`text-sm ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Longitude: {preferences.location.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Power Management */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Battery className={`w-5 h-5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.low_power')}
              </h3>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.lowPowerMode}
                onChange={(e) => updatePreference('lowPowerMode', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className={`font-medium ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                  Enable Low Power Mode
                </span>
                <p className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reduces background activity and uses darker theme to save battery
                </p>
              </div>
            </label>
          </div>

          {/* Notification Settings */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Bell className={`w-5 h-5 ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.notifications')}
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications.alerts}
                  onChange={(e) => updatePreference('notifications', {
                    ...preferences.notifications,
                    alerts: e.target.checked
                  })}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                    Emergency Alerts
                  </span>
                  <p className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive notifications for emergency alerts in your area
                  </p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications.requests}
                  onChange={(e) => updatePreference('notifications', {
                    ...preferences.notifications,
                    requests: e.target.checked
                  })}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
                    Help Requests
                  </span>
                  <p className={`text-sm ${lowPowerMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get notified about help requests in your area
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Security Info */}
          <div className={`p-4 rounded-lg border ${
            lowPowerMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start space-x-3">
              <Shield className={`w-5 h-5 mt-0.5 ${lowPowerMode ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <h4 className={`font-semibold ${lowPowerMode ? 'text-green-400' : 'text-green-800'}`}>
                  Data Security
                </h4>
                <p className={`text-sm mt-1 ${lowPowerMode ? 'text-green-300' : 'text-green-700'}`}>
                  All your data is encrypted and stored locally on your device. 
                  We only sync essential information when you're connected to the internet.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={savePreferences}
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : t('common.save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;