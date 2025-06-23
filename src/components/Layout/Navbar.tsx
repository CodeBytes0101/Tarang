import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, AlertTriangle, HelpCircle, Map, Settings, Wifi, WifiOff, Shield } from 'lucide-react';

interface NavbarProps {
  isOnline: boolean;
  lowPowerMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isOnline, lowPowerMode }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.dashboard') },
    { path: '/emergency', icon: AlertTriangle, label: t('navigation.emergency') },
    { path: '/help', icon: HelpCircle, label: t('navigation.help') },
    { path: '/alerts', icon: Shield, label: 'AI Alerts' },
    { path: '/map', icon: Map, label: t('navigation.map') },
    { path: '/settings', icon: Settings, label: t('navigation.settings') }
  ];

  return (
    <div className={`${
      lowPowerMode ? 'bg-gray-900' : 'bg-white'
    } border-t border-gray-200 ${lowPowerMode ? 'border-gray-700' : ''}`}>
      {/* Connection Status */}
      <div className={`flex items-center justify-center py-1 text-xs ${
        isOnline 
          ? 'bg-green-100 text-green-800' 
          : lowPowerMode 
            ? 'bg-yellow-900 text-yellow-200'
            : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            {t('common.online')}
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 mr-1" />
            {t('common.offline')}
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex justify-around py-2 overflow-x-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors min-w-0 ${
                isActive
                  ? lowPowerMode
                    ? 'text-red-400 bg-gray-800'
                    : 'text-red-600 bg-red-50'
                  : lowPowerMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-label={label}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;