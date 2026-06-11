import React from 'react';
import {
  LayoutDashboard, FileText, Users, Building2, Bell, Settings, LogOut,
  ChevronRight, Activity, Shield, X, Zap
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, user, setIsLoggedIn }) => {
  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', desc: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'All Reports', desc: 'Manage' },
    { id: 'users', icon: Users, label: 'Users', desc: 'Accounts' },
    { id: 'vendors', icon: Building2, label: 'Vendors', desc: 'Suppliers' },
    { id: 'notifications', icon: Bell, label: 'Alerts', desc: 'Activity' },
    { id: 'settings', icon: Settings, label: 'Settings', desc: 'Config' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('qprs_user');
    localStorage.removeItem('qprs_isLoggedIn');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const SidebarContent = ({ isMobile }) => (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-950 border-r border-slate-200 dark:border-transparent transition-colors duration-300">
      {/* Logo */}
      <div className="p-5 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 relative overflow-hidden">
            <Shield className="w-5 h-5 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"></div>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">ADMIN PANEL</h1>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] font-semibold">Control Center</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.04] transition-all">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xs shadow-lg overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                user?.avatar || 'AD'
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-950"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center"><Zap size={9} className="mr-1 text-yellow-500" />Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] px-3 mb-3">Main Menu</p>
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
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 border border-red-500 shadow-lg shadow-red-500/20'
                  : 'hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/[0.04] group-hover:bg-slate-200 dark:group-hover:bg-white/[0.08]'
                }`}>
                  <Icon size={16} className={isActive ? 'text-black' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white'} />
                </div>
                <div className="text-left">
                  <span className={`text-sm font-medium block ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-red-200' : 'text-slate-400 dark:text-slate-500'}`}>{item.desc}</span>
                </div>
              </div>
              {isActive && (
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  <ChevronRight size={12} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity size={10} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">System</span>
            </div>
            <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-mono font-bold">ONLINE</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 dark:from-emerald-500 dark:to-yellow-400 h-1 rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );



  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-[260px] shadow-2xl shadow-black/30">
        <SidebarContent isMobile={false} />
      </aside>
      <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-[260px] transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 shadow-2xl`}>
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>
        <SidebarContent isMobile={true} />
      </aside>
    </>
  );
};

export default AdminSidebar;
