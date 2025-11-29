import React, { ReactNode, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut, Shield, ClipboardList, BarChart2, Users, Trophy, Newspaper, ChevronLeft, ChevronRight, FileText, UserCircle2, BookCopy } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  navItems: { name: string; icon: ReactNode; onClick: () => void; }[];
  activeView: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, navItems, activeView }) => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 bg-gray-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`h-16 flex items-center border-b border-gray-700 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <Trophy className="h-8 w-8 text-indigo-400 flex-shrink-0" />
            <h1 className={`text-xl font-bold text-white ml-2 whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0' : 'w-auto'}`}>{t('app.title')}</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`w-full flex items-center py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isCollapsed ? 'justify-center px-2' : 'px-4'} ${
                activeView === item.name
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0' : 'w-auto'}`}>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-gray-700 space-y-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-full flex items-center py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
              title={isCollapsed ? t('layout.collapse') : t('layout.collapse')}
            >
              <div className="flex-shrink-0">{isCollapsed ? <ChevronRight className="h-5 w-5"/> : <ChevronLeft className="h-5 w-5" />}</div>
              <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0' : 'w-auto'}`}>{t('layout.collapse')}</span>
            </button>

            <button
              onClick={logout}
              className={`w-full flex items-center py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
              title={isCollapsed ? t('layout.logout') : undefined}
            >
              <div className="flex-shrink-0"><LogOut className="h-5 w-5" /></div>
              <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0' : 'w-auto'}`}>{t('layout.logout')}</span>
            </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">{activeView}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role ? t(`roles.${user.role}`) : ''}</p>
            </div>
             {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
            ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export { Shield, ClipboardList, BarChart2, Users, Trophy, Newspaper, ChevronLeft, ChevronRight, FileText, UserCircle2, BookCopy };
export default MainLayout;