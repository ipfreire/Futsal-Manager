
import React, { useState } from 'react';
import MainLayout, { Users, ClipboardList, BarChart2, Newspaper } from '../layout/MainLayout';
import RosterManagement from './RosterManagement';
import TrainingPlanner from './TrainingPlanner';
import LiveGameTracker from './LiveGameTracker';
import GameDayCallup from './GameDayCallup';
import { useI18n } from '../../context/I18nContext';

const CoachDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('Roster');
  const { t } = useI18n();

  const navItems = [
    { name: 'Roster', icon: <Users className="h-5 w-5" />, onClick: () => setActiveView('Roster') },
    { name: 'Training Planner', icon: <ClipboardList className="h-5 w-5" />, onClick: () => setActiveView('Training Planner') },
    { name: 'Game Day Call-up', icon: <Newspaper className="h-5 w-5" />, onClick: () => setActiveView('Game Day Call-up') },
    { name: 'Live Game Tracker', icon: <BarChart2 className="h-5 w-5" />, onClick: () => setActiveView('Live Game Tracker') },
  ];
  
  const translatedNavItems = navItems.map(item => ({...item, name: t(`navigation.${item.name.replace(/\s|-/g, '')}`)}))
  
  const translatedActiveView = t(`navigation.${activeView.replace(/\s|-/g, '')}`);

  const renderContent = () => {
    switch (activeView) {
      case 'Roster':
        return <RosterManagement />;
      case 'Training Planner':
        return <TrainingPlanner />;
      case 'Game Day Call-up':
        return <GameDayCallup />;
      case 'Live Game Tracker':
        return <LiveGameTracker />;
      default:
        return <RosterManagement />;
    }
  };

  return (
    <MainLayout navItems={translatedNavItems} activeView={translatedActiveView}>
      {renderContent()}
    </MainLayout>
  );
};

export default CoachDashboard;
