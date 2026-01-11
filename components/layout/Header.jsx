import React from 'react';
import { Layout, Search, Bell, Menu } from 'lucide-react';

const Header = ({ activeTab, setIsMobileMenuOpen, user }) => {
  const getPageTitle = (tab) => {
    const titles = {
      'dashboard': 'Quality Dashboard',
      'new': 'Create New Report',
      'my-reports': 'My Quality Reports',
      'analytics': 'Analytics & Insights',
      'settings': 'Settings'
    };
    return titles[tab] || 'Dashboard';
  };

  const getPageDescription = (tab) => {
    const descriptions = {
      'dashboard': 'Monitor quality metrics and reports',
      'new': 'Submit new quality issues',
      'my-reports': 'View and manage submitted reports',
      'analytics': 'Analyze defect trends and patterns',
      'settings': 'Configure system preferences'
    };
    return descriptions[tab] || '';
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Page Title */}
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                {getPageTitle(activeTab)}
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                {getPageDescription(activeTab)}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Hidden on mobile, visible on medium+ */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search reports, vendors..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name?.split(' ')[0] || "User"}</p>
                <p className="text-xs text-gray-500">{user?.role || "Role"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.avatar?.charAt(0) || "U"
                )}
              </div>
            </div>

            {/* Mobile User Icon */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.avatar?.charAt(0) || "U"
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search - Only shows on mobile */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;