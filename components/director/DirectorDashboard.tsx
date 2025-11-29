
import React, { useState } from 'react';
import MainLayout, { Shield, Users } from '../layout/MainLayout';
import ClubInfoEditor from './ClubInfoEditor';
import ViewTeamData from './ViewTeamData';
import { useI18n } from '../../context/I18nContext';

const DirectorDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('Club Info');
  const { t } = useI18n();

  const navItems = [
    { name: 'Club Info', icon: <Shield className="h-5 w-5" />, onClick: () => setActiveView('Club Info') },
    { name: 'View Team Data', icon: <Users className="h-5 w-5" />, onClick: () => setActiveView('View Team Data') },
  ];

  const translatedNavItems = navItems.map(item => ({...item, name: t(`navigation.${item.name.replace(/\s|-/g, '')}`)}))
  
  const translatedActiveView = t(`navigation.${activeView.replace(/\s|-/g, '')}`);

  const renderContent = () => {
    switch (activeView) {
      case 'Club Info':
        return <ClubInfoEditor />;
      case 'View Team Data':
        return <ViewTeamData />;
      default:
        return <ClubInfoEditor />;
    }
  };

  return (
    <MainLayout navItems={translatedNavItems} activeView={translatedActiveView}>
      {renderContent()}
    </MainLayout>
  );
};

export default DirectorDashboard;