import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, ArrowUp, ArrowDown, Users, Activity } from 'lucide-react';

const AnalyticsPage = () => {
  // Mock Data
  const defectData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 32 },
    { label: 'Mar', value: 58 },
    { label: 'Apr', value: 42 },
    { label: 'May', value: 65 },
    { label: 'Jun', value: 25 },
  ];
  const maxDefect = Math.max(...defectData.map(d => d.value));

  const vendorData = [
    { name: 'ABC Ltd', value: 35, color: '#3b82f6' },  // blue
    { name: 'Tata Steel', value: 25, color: '#10b981' }, // emerald
    { name: 'SKF India', value: 20, color: '#f59e0b' }, // amber
    { name: 'Bosch Ltd', value: 15, color: '#ef4444' }, // red
    { name: 'Others', value: 5, color: '#6366f1' },    // indigo
  ];

  // Helper for Conic Gradient
  const getConicGradient = () => {
    let currentDeg = 0;
    const stops = vendorData.map(item => {
      const deg = (item.value / 100) * 360;
      const stop = `${item.color} ${currentDeg}deg ${currentDeg + deg}deg`;
      currentDeg += deg;
      return stop;
    }).join(', ');
    return `conic-gradient(${stops})`;
  };

  return (
    <div className="space-y-6 animate-slide-right pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-400 mt-1">Deep dive into quality metrics and performance</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-xs md:text-sm font-semibold flex items-center shadow-sm">
            <Activity size={14} className="mr-2" /> Live Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Defect Trends - Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover-card transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">Defect Trends</h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">Monthly breakdown of reported issues</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="h-48 md:h-64 flex items-stretch justify-between space-x-2 sm:space-x-4 pt-4 px-1 md:px-2">
            {defectData.map((item, index) => {
              const heightPercentage = (item.value / maxDefect) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="relative w-full flex-1 flex items-end justify-center">
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full max-w-[24px] md:max-w-[40px] bg-gradient-to-t from-blue-600 to-cyan-500 dark:from-blue-600 dark:to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:opacity-90 group-hover:scale-y-105 relative shadow-lg"
                    >
                      {/* Tooltip */}
                      <div className="hidden md:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl border border-gray-700">
                        {item.value} Errors
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-gray-600 dark:text-slate-400 mt-3 h-6 flex items-center">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vendors - Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover-card transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">Vendor Distribution</h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">Share of defects by vendor</p>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-slate-700 rounded-lg">
              <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 h-auto md:h-64 pb-4 md:pb-0">
            {/* CSS Conic Gradient Donut */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg flex-shrink-0" style={{ background: getConicGradient() }}>
              {/* Center Hole */}
              <div className="absolute inset-0 m-auto w-28 h-28 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">100%</span>
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 w-full sm:w-auto mt-4 sm:mt-0">
              {vendorData.map((vendor, idx) => (
                <div key={idx} className="flex items-center justify-between sm:justify-start gap-2 md:gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: vendor.color }}></span>
                    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-slate-300 truncate">{vendor.name}</span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{vendor.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:col-span-2">
          {[
            { label: 'Avg Resolution Time', value: '4.2 Days', trend: '-12%', isPositive: true },
            { label: 'Repeat Defects', value: '18%', trend: '+2.4%', isPositive: false },
            { label: 'Cost of Quality', value: '$12.5k', trend: '-5%', isPositive: true },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">{kpi.label}</p>
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</h4>
              </div>
              <div className={`flex items-center px-2 py-1 md:px-2.5 rounded-full text-[10px] md:text-xs font-bold ${kpi.isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                {kpi.isPositive ? <ArrowDown size={12} className="mr-1" /> : <ArrowUp size={12} className="mr-1" />}
                {kpi.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
