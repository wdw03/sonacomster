import React, { useState, useEffect } from 'react';
import LoginPage from './components/pages/LoginPage';
import Dashboard from './components/pages/Dashboard';
import NewReport from './components/pages/NewReport';
import MyReports from './components/pages/MyReports';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AnalyticsPage from './components/pages/AnalyticsPage';
import SettingsPage from './components/pages/SettingsPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLogin = localStorage.getItem('qprs_isLoggedIn');
    return savedLogin === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const savedUser = localStorage.getItem('qprs_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (isLoggedIn) {
      setUser({
        name: "Amit Sharma",
        role: "Quality Manager",
        department: "Quality Assurance",
        avatar: "AS",
        employeeId: "EMP001",
        email: "amit.sharma@sonacomstar.com"
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('qprs_isLoggedIn', isLoggedIn);
    if (user) {
      localStorage.setItem('qprs_user', JSON.stringify(user));
    }
  }, [isLoggedIn, user]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData || {
      name: "Amit Sharma",
      role: "Quality Manager",
      department: "Quality Assurance",
      avatar: "AS",
      employeeId: "EMP001",
      email: "amit.sharma@sonacomstar.com"
    });
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 font-sans transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'new' && <NewReport />}
          {activeTab === 'my-reports' && <MyReports />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && (
            <SettingsPage
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(!darkMode)}
              user={user}
              updateUser={(newUserData) => setUser({ ...user, ...newUserData })}
            />
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}



export default App;