import React from 'react';
import { Activity, Shield } from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.04] bg-white/50 dark:bg-gray-950/50 py-3 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left flex items-center justify-center md:justify-start space-x-3">
            <div className="flex items-center space-x-2">
              <Shield size={12} className="text-red-500" />
              <span className="text-xs font-mono text-slate-800 dark:text-white">Admin Console v2.0</span>
            </div>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <div className="flex items-center space-x-1.5">
              <Activity size={10} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-mono font-bold">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
          <div className="mt-2 md:mt-0 text-center md:text-right">
            <p className="text-[10px] text-slate-500 dark:text-white font-mono">
              © {currentYear} SONACOMSTAR • Authorized Access Only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
