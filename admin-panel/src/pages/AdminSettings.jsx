import React, { useState } from 'react';
import { Settings, Server, Database, Clock, Shield, Bell, Trash2, Save, CheckCircle } from 'lucide-react';

const AdminSettings = ({ user }) => {
  const [slaWarning, setSlaWarning] = useState(() => localStorage.getItem('sla-warning') || '48');
  const [slaCritical, setSlaCritical] = useState(() => localStorage.getItem('sla-critical') || '72');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('sla-warning', slaWarning);
    localStorage.setItem('sla-critical', slaCritical);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearTour = () => {
    localStorage.removeItem('admin-tour-done');
    alert('Tour reset! Refresh the page to see it again.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure system preferences and SLA rules</p>
      </div>

      {/* Admin Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Shield size={16} className="mr-2 text-brand-primary" />Admin Profile</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-btn flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
            {user?.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" /> : user?.avatar || 'SV'}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{user?.name || 'Admin'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'admin@sonacomstar.com'}</p>
            <p className="text-xs text-brand-primary font-semibold mt-0.5">Super Admin • {user?.department || 'Administration'}</p>
          </div>
        </div>
      </div>

      {/* SLA Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Clock size={16} className="mr-2 text-amber-500" />SLA Configuration</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set thresholds for report aging alerts</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Warning Threshold (hours)</label>
            <input type="number" value={slaWarning} onChange={(e) => setSlaWarning(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-btn text-slate-800 dark:text-white" />
            <p className="text-[10px] text-slate-400 mt-1">Reports pending longer than this will show yellow badge</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Critical Threshold (hours)</label>
            <input type="number" value={slaCritical} onChange={(e) => setSlaCritical(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-btn text-slate-800 dark:text-white" />
            <p className="text-[10px] text-slate-400 mt-1">Reports pending longer than this will show red badge with animation</p>
          </div>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-brand-btn to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-md text-sm">
          {saved ? <><CheckCircle size={16} /><span>Saved!</span></> : <><Save size={16} /><span>Save Settings</span></>}
        </button>
      </div>

      {/* System Information */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Server size={16} className="mr-2 text-brand-btn" />System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <span className="text-sm text-slate-600 dark:text-slate-400">App Version</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">v2.0.0</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <span className="text-sm text-slate-600 dark:text-slate-400">Server Status</span>
            <span className="text-sm font-bold text-emerald-500 flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center"><Database size={14} className="mr-1.5 text-emerald-500" />MongoDB Atlas</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <span className="text-sm text-slate-600 dark:text-slate-400">API Base</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">localhost:5000</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Trash2 size={16} className="mr-2 text-red-500" />Data Management</h3>
        <div className="space-y-3">
          <button onClick={clearTour} className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            Reset Welcome Tour
          </button>
          <p className="text-[10px] text-slate-400">Resets the onboarding tour so it shows again on next login</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
