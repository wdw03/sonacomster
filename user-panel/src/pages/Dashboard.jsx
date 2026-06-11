import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Clock, CheckCircle, XCircle,
  TrendingUp, FilePlus, ChevronRight, Eye,
  Users, AlertTriangle, Package, Download,
  BarChart3, Filter, Calendar, ArrowUpRight,
  TrendingDown
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const [recentReports, setRecentReports] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [defectTypes, setDefectTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Color mapping for different statuses
  const colorMap = {
    blue: { bg: 'bg-brand-btn/10', text: 'text-brand-primary', border: 'border-brand-btn/20' },
    amber: { bg: 'bg-brand-secondary/10', text: 'text-brand-secondary', border: 'border-brand-secondary/20' },
    green: { bg: 'bg-brand-primary/10', text: 'text-brand-primary', border: 'border-brand-primary/20' },
    red: { bg: 'bg-brand-secondary/10', text: 'text-brand-secondary', border: 'border-brand-secondary/20' },
    purple: { bg: 'bg-brand-btn/10', text: 'text-brand-primary', border: 'border-brand-btn/20' },
    gray: { bg: 'bg-gray-100', text: 'text-brand-secondary', border: 'border-gray-200' }
  };

  // Sample data - In real app, this would come from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { default: api } = await import('../api.js');

        const [statsRes, reportsRes, vendorsRes, defectsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent'),
          api.get('/dashboard/vendors'),
          api.get('/dashboard/defects')
        ]);

        setStats(statsRes.data);
        setRecentReports(reportsRes.data);
        setTopVendors(vendorsRes.data);
        setDefectTypes(defectsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard API Error:", error);
        // Do not fall back to mock data
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsData = [
    {
      label: 'Total Reports',
      value: stats.totalReports,
      icon: ClipboardList,
      color: 'blue',
      change: '+12%',
      description: 'Overall reports submitted'
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'amber',
      change: '-5%',
      description: 'Awaiting action'
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'green',
      change: '+8%',
      description: 'Successfully resolved'
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'red',
      change: '+3%',
      description: 'Requires attention'
    },
  ];

  const quickActions = [
    {
      icon: FilePlus,
      label: 'New Report',
      color: 'blue',
      description: 'Create quality report',
      action: () => setActiveTab('new')
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      color: 'purple',
      description: 'Detailed insights',
      action: () => setActiveTab('analytics')
    },
    {
      icon: Download,
      label: 'Export Data',
      color: 'green',
      description: 'Download reports',
      action: async () => {
        try {
          const { default: api } = await import('../api.js');
          const response = await api.get('/reports');
          const reports = response.data;

          if (!reports || reports.length === 0) return alert('No data to export');

          const headers = ['Report ID', 'Item', 'Vendor', 'Department', 'Defect Type', 'Quantity', 'Priority', 'Status', 'Date'];
          const csvRows = [headers.join(',')];

          reports.forEach(report => {
            const row = [
              report.id,
              `"${report.item || ''}"`,
              `"${report.vendor || ''}"`,
              `"${report.department || ''}"`,
              `"${report.defectType || ''}"`,
              report.qty || 0,
              report.priority || '',
              report.status || '',
              report.date || ''
            ];
            csvRows.push(row.join(','));
          });

          const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "dashboard_quality_reports.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Export Error:", error);
          alert('Failed to export data');
        }
      }
    },
    {
      icon: Filter,
      label: 'Advanced Filter',
      color: 'gray',
      description: 'Custom filters',
      action: () => {
        alert('Opening advanced filters...');
      }
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-brand-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-brand-btn rounded-2xl p-4 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ClipboardList size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Quality Team! 👋</h1>
                <p className="text-blue-200">Here's what's happening with your quality reports today.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-300" />
                <span className="text-sm text-blue-200">{new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300">System Active</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setActiveTab('new')}
              className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
            >
              <FilePlus size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Create New Report</span>
              <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const colors = colorMap[stat.color] || colorMap.blue;
          const IconComponent = stat.icon;
          const isPositive = stat.change.startsWith('+');

          return (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border ${colors.border} dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-secondary dark:text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-white mt-2">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-brand-secondary dark:text-slate-500 mt-1">{stat.description}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    {isPositive ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <IconComponent size={24} className={colors.text} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Reports & Defect Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-brand-primary">Recent Reports</h3>
                <p className="text-sm text-brand-secondary mt-1">Latest quality issues reported</p>
              </div>
              <button
                onClick={() => setActiveTab('my-reports')}
                className="text-sm text-brand-primary font-medium hover:text-brand-primary flex items-center space-x-1 group"
              >
                <span>View All Reports</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentReports.map((report, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${report.priority === 'high' ? 'bg-red-500' :
                        report.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-brand-primary">{report.id}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.status === 'approved' ? 'bg-green-100 text-green-800' :
                            report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-brand-primary font-medium mt-1">{report.item}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs text-brand-secondary bg-gray-100 px-2 py-1 rounded">
                            {report.vendor}
                          </span>
                          <span className="text-xs text-brand-secondary bg-gray-100 px-2 py-1 rounded">
                            {report.defectType}
                          </span>
                          <span className="text-xs text-brand-secondary">{report.date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.setItem('viewReportId', report.id);
                        setActiveTab('my-reports');
                      }}
                      className="ml-4 text-brand-primary hover:text-brand-primary hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defect Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-brand-primary mb-4">Defect Type Analysis</h3>
            <div className="space-y-4">
              {defectTypes.map((defect, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-primary font-medium">{defect.type}</span>
                    <span className="font-semibold">{defect.count} cases ({defect.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${index === 0 ? 'bg-brand-btn' :
                        index === 1 ? 'bg-red-500' :
                          index === 2 ? 'bg-amber-500' :
                            index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                        }`}
                      style={{ width: `${defect.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Top Vendors */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-brand-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const colors = colorMap[action.color] || colorMap.blue;
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <ActionIcon size={20} className={colors.text} />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-brand-primary">{action.label}</span>
                        <p className="text-xs text-brand-secondary">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-secondary group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-brand-primary mb-4">Top Vendors by Issues</h3>
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-blue-50' :
                      index === 1 ? 'bg-green-50' :
                        index === 2 ? 'bg-amber-50' : 'bg-purple-50'
                      }`}>
                      <Users size={18} className={
                        index === 0 ? 'text-brand-primary' :
                          index === 1 ? 'text-green-600' :
                            index === 2 ? 'text-amber-600' : 'text-purple-600'
                      } />
                    </div>
                    <div>
                      <p className="font-medium text-brand-primary">{vendor.name}</p>
                      <p className="text-xs text-brand-secondary">{vendor.resolved} resolved of {vendor.issues} issues</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-semibold text-brand-primary">
                        {Math.round((vendor.resolved / vendor.issues) * 100)}%
                      </span>
                      {vendor.trend === 'up' ? (
                        <TrendingUp size={12} className="text-green-500" />
                      ) : (
                        <TrendingDown size={12} className="text-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-brand-secondary">Success rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white border border-brand-secondary/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-brand-primary">System Status</h4>
                <p className="text-sm text-brand-secondary mt-1">All systems operational</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-secondary">Uptime</span>
                <span className="font-semibold">99.9%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-secondary">Active Users</span>
                <span className="font-semibold">42 online</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-brand-secondary">Reports Today</span>
                <span className="font-semibold">18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
