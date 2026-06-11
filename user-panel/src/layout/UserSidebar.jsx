import React from 'react';
import {
  Home, FilePlus, ClipboardList, BarChart3, Settings,
  LogOut, ChevronRight, Activity, X, Sparkles
} from 'lucide-react';

const UserSidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, user, setIsLoggedIn }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', desc: 'Overview' },
    { id: 'new', icon: FilePlus, label: 'New Report', desc: 'Submit issue' },
    { id: 'my-reports', icon: ClipboardList, label: 'My Reports', desc: 'Track status' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', desc: 'Insights' },
    { id: 'settings', icon: Settings, label: 'Settings', desc: 'Preferences' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('qprs_user');
    localStorage.removeItem('qprs_isLoggedIn');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const SidebarContent = ({ isMobile }) => (
    <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 border-r border-rose-100 dark:border-slate-800 text-black dark:text-white transition-colors duration-300">
      {/* Logo */}
      <div className="p-5 border-b border-rose-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 shadow-sm border border-rose-100 dark:border-slate-600">
            <img src="/sonacomsterlogo.png" alt="Logo" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-black dark:text-white">SONACOMSTAR</h1>
            <p className="text-[10px] text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] font-bold">Quality Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-rose-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-rose-50/80 dark:hover:bg-slate-800 transition-all duration-200 group text-left"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 dark:from-red-500 dark:to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-rose-200 dark:shadow-none group-hover:scale-105 transition-transform overflow-hidden ring-2 ring-white dark:ring-slate-700">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.avatar || 'US'
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black dark:text-white truncate">{user?.name || 'Employee'}</p>
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{user?.department || 'Quality Assurance'}</p>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em] px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-red-600 dark:to-red-500 border border-rose-200 dark:border-red-400 shadow-sm'
                  : 'hover:bg-orange-50/60 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-rose-400 to-pink-500 dark:from-white dark:to-gray-200 shadow-lg shadow-rose-200 dark:shadow-none'
                    : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-100 dark:group-hover:bg-slate-700'
                }`}>
                  <Icon size={18} className={isActive ? 'text-white dark:text-black' : 'text-black dark:text-white group-hover:text-rose-500 dark:group-hover:text-red-400'} />
                </div>
                <div className="text-left">
                  <span className={`text-sm font-semibold block ${isActive ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>{item.desc}</span>
                </div>
              </div>
              {isActive && <ChevronRight size={14} className="text-rose-500 dark:text-white" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-4 border-t border-rose-100 dark:border-slate-800">
        {/* Quick Tip */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border border-rose-100 dark:border-slate-700 mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles size={12} className="text-rose-500 dark:text-yellow-400" />
            <span className="text-[10px] text-rose-600 dark:text-yellow-400 uppercase tracking-wider font-bold">Quick Tip</span>
          </div>
          <p className="text-[11px] text-black dark:text-white leading-relaxed">Submit reports with images for faster resolution.</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-rose-500 to-pink-500 dark:from-red-600 dark:to-red-700 hover:from-rose-600 hover:to-pink-600 dark:hover:from-red-500 dark:hover:to-red-600 rounded-2xl transition-all duration-300 shadow-lg shadow-rose-200 dark:shadow-none group text-white"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-[270px] shadow-xl shadow-rose-100/50">
        <SidebarContent isMobile={false} />
      </aside>

      {/* Mobile */}
      <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-[270px] transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 shadow-2xl`}>
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        <SidebarContent isMobile={true} />
      </aside>
    </>
  );
};

export default UserSidebar;
