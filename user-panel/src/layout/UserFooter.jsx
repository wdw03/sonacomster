import React from 'react';
import { Heart } from 'lucide-react';

const UserFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-rose-100 dark:border-slate-800 bg-gradient-to-r from-rose-50/50 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-3 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-black dark:text-white flex items-center justify-center md:justify-start space-x-1">
              <span>© {currentYear} SONACOMSTAR Quality Portal</span>
              <Heart size={12} className="text-rose-500 dark:text-red-500 fill-rose-500 dark:fill-red-500" />
            </p>
            <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-0.5">
              Empowering quality, one report at a time
            </p>
          </div>
          <div className="mt-2 md:mt-0 flex justify-center md:justify-end space-x-4">
            <a href="#" className="text-xs text-black dark:text-white hover:text-rose-600 dark:hover:text-red-400 transition-colors font-medium">Help</a>
            <span className="text-rose-200 dark:text-slate-600">|</span>
            <a href="#" className="text-xs text-black dark:text-white hover:text-rose-600 dark:hover:text-red-400 transition-colors font-medium">Privacy</a>
            <span className="text-rose-200 dark:text-slate-600">|</span>
            <a href="#" className="text-xs text-black dark:text-white hover:text-rose-600 dark:hover:text-red-400 transition-colors font-medium">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
