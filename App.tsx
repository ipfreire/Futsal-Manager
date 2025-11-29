
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { I18nProvider } from './context/I18nContext';
import LoginScreen from './components/auth/LoginScreen';
import DirectorDashboard from './components/director/DirectorDashboard';
import CoachDashboard from './components/coach/CoachDashboard';
import AthleteDashboard from './components/athlete/AthleteDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.Director:
        return <DirectorDashboard />;
      case UserRole.Coach:
        return <CoachDashboard />;
      case UserRole.Athlete:
        return <AthleteDashboard />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {renderDashboard()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <I18nProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </I18nProvider>
    </AuthProvider>
  );
};

export default App;
