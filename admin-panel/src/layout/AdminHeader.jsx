import React from 'react';
import { Menu, Search, Sun, Moon, Bell, Shield } from 'lucide-react';

const AdminHeader = ({ activeTab, setIsMobileMenuOpen, user, darkMode, setDarkMode }) => {
  const titles = {
    overview: { title: 'Dashboard Overview', desc: 'Real-time analytics & system health' },
    reports: { title: 'Report Management', desc: 'Review, approve & control employee reports' },
    users: { title: 'User Management', desc: 'Employee accounts, roles & permissions' },
    vendors: { title: 'Vendor Management', desc: 'Supplier quality tracking & scorecards' },
    notifications: { title: 'System Alerts', desc: 'Activity log & notifications' },
    settings: { title: 'Admin Configuration', desc: 'System preferences & security' },
  };

  const current = titles[activeTab] || titles.overview;

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.04] shadow-sm dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-white flex items-center">
                {current.title}
                <span className="ml-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-500/20 hidden sm:inline-block">
                  <Shield size={9} className="inline mr-1" />Admin
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{current.desc}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={15} />
              <input
                id="admin-search"
                type="text"
                placeholder="Search... (Ctrl+K)"
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] rounded-xl text-sm text-slate-800 dark:text-slate-300 focus:ring-1 focus:ring-red-500/50 focus:border-red-500/30 outline-none w-52 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono"
              />
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-500" />}
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors">
              <Bell size={16} className="text-slate-500 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950 animate-pulse"></span>
            </button>

            {/* Profile (desktop) */}
            <div className="hidden md:flex items-center space-x-3 pl-3 ml-1 border-l border-slate-200 dark:border-white/[0.06]">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-[9px] text-red-500 dark:text-white font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-[10px] shadow-md shadow-red-500/20 overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.avatar?.charAt(0) || 'A'
                )}
              </div>
            </div>

            {/* Mobile Profile */}
            <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-[10px] overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.avatar?.charAt(0) || 'A'
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
