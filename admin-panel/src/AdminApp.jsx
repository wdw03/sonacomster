import React, { useState, useEffect } from 'react';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminFooter from './layout/AdminFooter';
import AdminOverview from './pages/AdminOverview';
import AdminReports from './pages/AdminReports';
import AdminUsers from './pages/AdminUsers';
import AdminVendors from './pages/AdminVendors';
import AdminNotifications from './pages/AdminNotifications';
import AdminSettings from './pages/AdminSettings';

const AdminApp = ({ user, setIsLoggedIn }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    return saved ? saved === 'dark' : true; // Admin defaults to dark
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); document.getElementById('admin-search')?.focus(); }
      if (e.ctrlKey && e.key === '1') { e.preventDefault(); setActiveTab('overview'); }
      if (e.ctrlKey && e.key === '2') { e.preventDefault(); setActiveTab('reports'); }
      if (e.ctrlKey && e.key === '3') { e.preventDefault(); setActiveTab('users'); }
      if (e.ctrlKey && e.key === '4') { e.preventDefault(); setActiveTab('vendors'); }
      if (e.ctrlKey && e.key === '5') { e.preventDefault(); setActiveTab('notifications'); }
      if (e.key === 'Escape') window.dispatchEvent(new CustomEvent('close-modals'));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'reports': return <AdminReports />;
      case 'users': return <AdminUsers />;
      case 'vendors': return <AdminVendors />;
      case 'notifications': return <AdminNotifications />;
      case 'settings': return <AdminSettings user={user} />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans transition-colors duration-500">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="md:ml-[260px] flex-1 flex flex-col min-h-screen">
        <AdminHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </div>

        <AdminFooter />

        {/* Keyboard shortcut hint */}
        <div className="fixed bottom-4 right-4 z-30 hidden lg:block">
          <div className="bg-gray-900/80 backdrop-blur-md border border-white/[0.06] rounded-xl px-3 py-2 shadow-lg text-[10px] text-slate-500 font-mono">
            <span className="text-cyan-400">Ctrl+K</span> Search &nbsp;|&nbsp;
            <span className="text-cyan-400">Ctrl+1-5</span> Navigate
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminApp;
