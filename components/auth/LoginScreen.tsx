
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { UserRole } from '../../types';

const LoginScreen: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Athlete);
  const { login } = useAuth();
  const { t } = useI18n();

  const handleLogin = () => {
    login(selectedRole);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-2.29c0-.28.11-.55.32-.74l1.83-1.66c.32-.29.32-.77 0-1.06l-1.83-1.66c-.21-.19-.32-.46-.32-.74V6.5c0-.41.34-.75.75-.75s.75.34.75.75v2.29c0 .28-.11.55-.32.74l-1.83 1.66c-.32.29-.32.77 0 1.06l1.83 1.66c.21.19.32.46.32.74v2.29c0 .41-.34.75-.75.75s-.75-.34-.75-.75z"/></svg>
            <h2 className="mt-6 text-3xl font-extrabold text-white">
                {t('app.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
                {t('login.subtitle')}
            </p>
        </div>
        <div className="space-y-6">
            <div>
                <label htmlFor="role-select" className="sr-only">{t('login.selectRole')}</label>
                <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value={UserRole.Director}>{t('roles.Director')}</option>
                    <option value={UserRole.Coach}>{t('roles.Coach')}</option>
                    <option value={UserRole.Athlete}>{t('roles.Athlete')}</option>
                </select>
            </div>
            <div>
                <button
                    onClick={handleLogin}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    {t('login.loginButton')}
                </button>
            </div>
            <div className="text-center">
                 <p className="text-xs text-gray-500">
                    {t('login.simulationNotice')}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
