import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { MOCK_USERS } from '../../constants';
import { User } from '../../types';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = (user: User) => {
    login(user.id);
    setIsModalOpen(false);
  };
  
  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.42,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-2.29c0-.28.11-.55.32-.74l1.83-1.66c.32-.29.32-.77 0-1.06l-1.83-1.66c-.21-.19-.32-.46-.32-.74V6.5c0-.41.34-.75.75-.75s.75.34.75.75v2.29c0 .28-.11.55-.32.74l-1.83 1.66c-.32.29-.32.77 0 1.06l1.83 1.66c.21.19.32.46.32.74v2.29c0 .41-.34.75-.75.75s-.75-.34-.75-.75z"/></svg>
            <h2 className="mt-6 text-3xl font-extrabold text-white">
                {t('app.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
                {t('login.subtitleV2')}
            </p>
        </div>
        <div className="space-y-6">
            <div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 text-sm font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
                >
                    <GoogleIcon />
                    {t('login.googleButton')}
                </button>
            </div>
            <div className="text-center">
                 <p className="text-xs text-gray-500">
                    {t('login.simulationNotice')}
                </p>
            </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-medium text-white mb-1">{t('login.modalTitle')}</h3>
            <p className="text-sm text-gray-400 mb-4">{t('login.modalSubtitle')}</p>
            <ul className="space-y-2">
              {MOCK_USERS.map(user => (
                <li key={user.id}>
                  <button onClick={() => handleLogin(user)} className="w-full flex items-center p-3 text-left bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <img className="w-10 h-10 rounded-full mr-4" src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} alt={user.name}/>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
             <button onClick={() => setIsModalOpen(false)} className="mt-4 w-full py-2 text-sm text-gray-300 hover:text-white">{t('common.cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;