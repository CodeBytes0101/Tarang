import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, MapPin, User, Phone } from 'lucide-react';
import { HelpRequest } from '../../types';
import { dataService } from '../../services/dataService';

interface HelpRequestFormProps {
  type: 'need' | 'offer';
  onSubmit: (request: HelpRequest) => void;
  lowPowerMode: boolean;
}

const HelpRequestForm: React.FC<HelpRequestFormProps> = ({ type, onSubmit, lowPowerMode }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    category: 'medical' as const,
    description: '',
    contactName: '',
    contactPhone: '',
    priority: 'medium' as const,
    location: { lat: 0, lng: 0, address: '' }
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const categories = [
    { value: 'medical', label: t('help.categories.medical') },
    { value: 'food', label: t('help.categories.food') },
    { value: 'shelter', label: t('help.categories.shelter') },
    { value: 'transport', label: t('help.categories.transport') },
    { value: 'rescue', label: t('help.categories.rescue') },
    { value: 'other', label: t('help.categories.other') }
  ];

  const priorities = [
    { value: 'low', label: t('help.priority.low'), color: 'text-green-600' },
    { value: 'medium', label: t('help.priority.medium'), color: 'text-yellow-600' },
    { value: 'high', label: t('help.priority.high'), color: 'text-orange-600' },
    { value: 'critical', label: t('help.priority.critical'), color: 'text-red-600' }
  ];

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
            }
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const request: HelpRequest = {
        id: Date.now().toString(),
        type,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        contactInfo: {
          name: formData.contactName,
          phone: formData.contactPhone
        },
        priority: formData.priority,
        timestamp: Date.now(),
        status: 'active',
        synced: false
      };

      await dataService.saveHelpRequest(request);
      onSubmit(request);

      // Reset form
      setFormData({
        category: 'medical',
        description: '',
        contactName: '',
        contactPhone: '',
        priority: 'medium',
        location: { lat: 0, lng: 0, address: '' }
      });
    } catch (error) {
      console.error('Error submitting help request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className={`text-xl font-bold mb-6 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
        {type === 'need' ? t('help.need') : t('help.offer')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              lowPowerMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              lowPowerMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Describe what help you need or can offer..."
            required
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <User className="w-4 h-4 inline mr-1" />
              Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                lowPowerMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Phone className="w-4 h-4 inline mr-1" />
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                lowPowerMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, address: e.target.value }
              }))}
              className={`flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                lowPowerMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter address or coordinates"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {locationLoading ? '...' : 'GPS'}
            </button>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${lowPowerMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Priority
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {priorities.map(priority => (
              <label
                key={priority.value}
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.priority === priority.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : lowPowerMode
                      ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority.value}
                  checked={formData.priority === priority.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="sr-only"
                />
                <span className={`font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          <span>{loading ? t('common.loading') : t('common.submit')}</span>
        </button>
      </form>
    </div>
  );
};

export default HelpRequestForm;