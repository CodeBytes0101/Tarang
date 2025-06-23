import React from 'react';
import AlertFeed from '../components/AI/AlertFeed';

interface AlertFeedPageProps {
  lowPowerMode: boolean;
}

const AlertFeedPage: React.FC<AlertFeedPageProps> = ({ lowPowerMode }) => {
  return <AlertFeed lowPowerMode={lowPowerMode} />;
};

export default AlertFeedPage;