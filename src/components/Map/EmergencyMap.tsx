import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EmergencyMapProps {
  lowPowerMode: boolean;
}

interface EmergencyLocation {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'relief_camp' | 'police' | 'fire_station';
  coordinates: [number, number];
  contact?: string;
  capacity?: number;
  available?: boolean;
}

const LocationUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const EmergencyMap: React.FC<EmergencyMapProps> = ({ lowPowerMode }) => {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [emergencyLocations, setEmergencyLocations] = useState<EmergencyLocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    loadEmergencyLocations();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const loadEmergencyLocations = () => {
    // Mock emergency locations - in real app, this would come from a local database
    const mockLocations: EmergencyLocation[] = [
      {
        id: '1',
        name: 'AIIMS Delhi',
        type: 'hospital',
        coordinates: [28.5672, 77.2100],
        contact: '011-26588500',
        available: true
      },
      {
        id: '2',
        name: 'Red Cross Shelter',
        type: 'shelter',
        coordinates: [28.6289, 77.2065],
        capacity: 500,
        available: true
      },
      {
        id: '3',
        name: 'Disaster Relief Camp',
        type: 'relief_camp',
        coordinates: [28.6167, 77.2167],
        capacity: 1000,
        available: true
      },
      {
        id: '4',
        name: 'Police Station - Connaught Place',
        type: 'police',
        coordinates: [28.6315, 77.2167],
        contact: '100'
      },
      {
        id: '5',
        name: 'Fire Station - Central Delhi',
        type: 'fire_station',
        coordinates: [28.6400, 77.2300],
        contact: '101'
      }
    ];
    
    setEmergencyLocations(mockLocations);
  };

  const getMarkerIcon = (type: string) => {
    const iconColor = {
      hospital: '#ef4444',      // red
      shelter: '#3b82f6',       // blue
      relief_camp: '#16a34a',   // green
      police: '#1d4ed8',        // blue
      fire_station: '#dc2626'   // red
    }[type] || '#6b7280';

    return L.divIcon({
      html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const getLocationTypeLabel = (type: string) => {
    const labels = {
      hospital: 'Hospital',
      shelter: 'Shelter',
      relief_camp: 'Relief Camp',
      police: 'Police Station',
      fire_station: 'Fire Station'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className={`${lowPowerMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
            {t('map.title')}
          </h2>
          <button
            onClick={getCurrentLocation}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>My Location</span>
          </button>
        </div>
      </div>

      <div className="h-96 relative">
        <MapContainer
          center={userLocation}
          zoom={13}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <LocationUpdater center={userLocation} />
          
          {/* Tile Layer - using OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User Location Marker */}
          <Marker
            position={userLocation}
            icon={L.divIcon({
              html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
              className: 'user-location-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>{t('map.your_location')}</strong>
              </div>
            </Popup>
          </Marker>
          
          {/* Emergency Location Markers */}
          {emergencyLocations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={getMarkerIcon(location.type)}
            >
              <Popup>
                <div className="min-w-48">
                  <h3 className="font-bold text-gray-900 mb-2">{location.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {getLocationTypeLabel(location.type)}
                  </p>
                  
                  {location.contact && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Contact:</span>
                      <a
                        href={`tel:${location.contact}`}
                        className="block text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {location.contact}
                      </a>
                    </div>
                  )}
                  
                  {location.capacity && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Capacity:</span>
                      <span className="block text-sm font-semibold">
                        {location.capacity} people
                      </span>
                    </div>
                  )}
                  
                  {location.available !== undefined && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        location.available ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-xs font-medium ${
                        location.available ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {location.available ? 'Available' : 'Full'}
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className={`p-4 border-t ${lowPowerMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <h3 className={`text-sm font-semibold mb-2 ${lowPowerMode ? 'text-white' : 'text-gray-900'}`}>
          Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-600'}>Hospitals</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-600'}>Shelters</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-600'}>Relief Camps</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
            <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-600'}>Police</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-600'}>Fire Stations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            <span className={lowPowerMode ? 'text-gray-300' : 'text-gray-600'}>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;