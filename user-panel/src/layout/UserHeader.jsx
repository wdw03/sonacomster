import React from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';

const UserHeader = ({ activeTab, setIsMobileMenuOpen, user, darkMode, setDarkMode }) => {
  const getPageTitle = (tab) => {
    const titles = {
      'dashboard': 'Dashboard',
      'new': 'New Report',
      'my-reports': 'My Reports',
      'analytics': 'Analytics',
      'settings': 'Settings'
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-rose-100/60 dark:border-slate-800 shadow-sm shadow-rose-50 dark:shadow-none transition-colors duration-300">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-black dark:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">Welcome back, <span className="font-bold text-black dark:text-white">{user?.name?.split(' ')[0] || 'User'}</span> 👋</p>
              <h2 className="text-lg md:text-xl font-bold text-black dark:text-white">{getPageTitle(activeTab)}</h2>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-9 pr-4 py-2.5 bg-rose-50/50 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 rounded-xl text-sm text-black dark:text-white focus:ring-2 focus:ring-rose-200 dark:focus:ring-slate-600 focus:border-rose-300 dark:focus:border-slate-500 outline-none w-52 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-black" />}
            </button>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 transition-colors text-black dark:text-white">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
            </button>

            {/* Profile (desktop) */}
            <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-rose-100 dark:border-slate-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-black dark:text-white">{user?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold uppercase">{user?.role || 'Employee'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 dark:from-red-500 dark:to-red-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-rose-200 dark:shadow-none overflow-hidden ring-2 ring-white dark:ring-slate-700">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.avatar?.charAt(0) || 'U'
                )}
              </div>
            </div>

            {/* Mobile Profile */}
            <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 dark:from-red-500 dark:to-red-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden ring-2 ring-white dark:ring-slate-700">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.avatar?.charAt(0) || 'U'
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-9 pr-4 py-2.5 bg-rose-50/50 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 rounded-xl text-sm text-black dark:text-white focus:ring-2 focus:ring-rose-200 dark:focus:ring-slate-600 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
