import React from 'react';
import {
  Layout, FilePlus, ClipboardList, LogOut,
  Home, BarChart3, Settings, ChevronRight,
  Shield, Activity
} from 'lucide-react';

const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  setIsLoggedIn
}) => {

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'new', icon: FilePlus, label: 'New Report' },
    { id: 'my-reports', icon: ClipboardList, label: 'My Reports' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('qprs_user');
    localStorage.removeItem('qprs_isLoggedIn');
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible on PC */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 w-64 bg-slate-900 border-r border-slate-800 text-white shadow-2xl">
        <div className="h-full w-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-transparent rounded-xl flex items-center justify-center shrink-0">
                <img src="/sonacomsterlogo.png" alt="Sona Comstar" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">SONACOMSTAR</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">QC System</p>
              </div>
            </div>
          </div>

          {/* User Profile - Clickable to go to Settings */}
          <div className="p-4 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group text-left"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform ring-2 ring-transparent group-hover:ring-cyan-400 overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.avatar || "US"
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-900 group-hover:animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">{user?.name || "User"}</h3>
                <p className="text-sm text-slate-400 truncate">{user?.role || "Role"}</p>
                <div className="flex items-center mt-0.5">
                  <Settings size={12} className="text-blue-400 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-xs text-blue-400 truncate opacity-60 group-hover:opacity-100 transition-opacity">Edit Profile</p>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-white/20 shadow-lg backdrop-blur-sm border border-white/10'
                    : 'hover:bg-white/10 hover:border hover:border-white/5'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive
                      ? 'bg-white shadow-lg'
                      : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                      <IconComponent
                        size={20}
                        className={isActive ? 'text-blue-600' : 'text-slate-400'}
                      />
                    </div>
                    <span className="font-medium text-white">{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="text-cyan-300 transform rotate-90"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status & Logout */}
          <div className="mt-auto">
            {/* System Status */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Activity size={14} className="text-green-400" />
                  <span className="text-xs text-slate-400">System Status</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-400">Live</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-400 to-cyan-400 h-1.5 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:from-red-600 hover:to-pink-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/20 group"
              >
                <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-300" />
                <span className="font-semibold text-white">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay - Only on mobile */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-transparent rounded-xl flex items-center justify-center shrink-0">
                <img src="/sonacomsterlogo.png" alt="Sona Comstar" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">SONACOMSTAR</h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">QC System v2.0</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.avatar || "US"
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{user?.name || "User"}</h3>
                <p className="text-sm text-slate-400">{user?.role || "Role"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                    ? 'bg-white/20 shadow-lg backdrop-blur-sm'
                    : 'hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent
                      size={20}
                      className={activeTab === item.id ? 'text-cyan-300' : 'text-slate-400'}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${activeTab === item.id ? 'rotate-90 text-cyan-300' : 'text-blue-400'
                      }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/20"
            >
              <LogOut size={18} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;