import React, { useState, useEffect } from 'react';
import UserSidebar from './layout/UserSidebar';
import UserHeader from './layout/UserHeader';
import UserFooter from './layout/UserFooter';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import MyReports from './pages/MyReports';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

const UserApp = ({ user, setIsLoggedIn, setUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('user-theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('user-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('user-theme', 'light');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'new': return <NewReport />;
      case 'my-reports': return <MyReports />;
      case 'analytics': return <AnalyticsPage />;
      case 'settings': return (
        <SettingsPage
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={user}
          updateUser={(newData) => setUser({ ...user, ...newData })}
        />
      );
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans transition-colors duration-300">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="md:ml-[270px] flex-1 flex flex-col min-h-screen">
        <UserHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </div>

        <UserFooter />
      </main>
    </div>
  );
};

export default UserApp;
