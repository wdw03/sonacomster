import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} SONACOMSTAR Quality Control System. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Version 2.0.1 • Last updated: January 2024
            </p>
          </div>
          <div className="mt-2 md:mt-0 flex justify-center md:justify-end space-x-4">
            <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;