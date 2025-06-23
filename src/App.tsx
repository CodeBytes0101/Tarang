import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';

import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Emergency from './pages/Emergency';
import Help from './pages/Help';
import Map from './pages/Map';
import Settings from './pages/Settings';
import AlertFeedPage from './pages/AlertFeed';

function App() {
  const { i18n } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check battery status and enable low power mode if battery is low
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          if (battery.level < 0.2 && !battery.charging) {
            setLowPowerMode(true);
          }
        };

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        updateBatteryStatus();
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Set document language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${lowPowerMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<Dashboard lowPowerMode={lowPowerMode} isOnline={isOnline} />} />
            <Route path="/emergency" element={<Emergency lowPowerMode={lowPowerMode} />} />
            <Route path="/help" element={<Help lowPowerMode={lowPowerMode} />} />
            <Route path="/map" element={<Map lowPowerMode={lowPowerMode} />} />
            <Route path="/alerts" element={<AlertFeedPage lowPowerMode={lowPowerMode} />} />
            <Route path="/settings" element={
              <Settings 
                lowPowerMode={lowPowerMode} 
                onLowPowerModeChange={setLowPowerMode} 
              />
            } />
          </Routes>
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Navbar isOnline={isOnline} lowPowerMode={lowPowerMode} />
        </div>
      </div>
    </Router>
  );
}

export default App;