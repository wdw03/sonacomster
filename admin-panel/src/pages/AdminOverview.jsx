import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, Brain, Activity, Building2, Users } from 'lucide-react';
import api from '../api';

const AdminOverview = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, overdue: 0, deptBreakdown: [], vendorBreakdown: [], priorityBreakdown: [] });
  const [activity, setActivity] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes, reportsRes] = await Promise.all([
        api.get('/reports/stats'),
        api.get('/reports/activity'),
        api.get('/reports')
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
      setRecentReports(reportsRes.data.slice(0, 8));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const statCards = [
    { label: 'Total Reports', value: stats.total, icon: FileText, color: 'from-blue-500 to-brand-btn', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Overdue (>48h)', value: stats.overdue, icon: AlertTriangle, color: 'from-brand-primary to-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-brand-btn/30 border-t-brand-btn rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const maxDeptCount = Math.max(...stats.deptBreakdown.map(d => d.count), 1);
  const priorityColors = { critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#10B981' };
  const totalPriority = stats.priorityBreakdown.reduce((sum, p) => sum + p.count, 0) || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-gray-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 group`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* AI Insight + SLA Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-brand-btn/5 to-brand-primary/5 dark:from-brand-btn/10 dark:to-brand-primary/10 rounded-2xl p-6 border border-brand-btn/10 dark:border-brand-btn/20">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <Brain className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">AI Smart Insight</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {stats.vendorBreakdown.length > 0
                  ? `${stats.vendorBreakdown[0]._id} has the most reports (${stats.vendorBreakdown[0].count}). ${stats.vendorBreakdown[0].pending > 0 ? `${stats.vendorBreakdown[0].pending} still pending review.` : 'All reports reviewed.'}`
                  : 'Submit reports to see AI predictions here.'
                }
              </p>
              {stats.overdue > 0 && (
                <p className="text-sm text-brand-primary font-semibold mt-2">⚠️ {stats.overdue} overdue report(s) need immediate attention!</p>
              )}
            </div>
          </div>
        </div>

        {stats.overdue > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800/30 animate-pulse">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="font-bold text-red-700 dark:text-red-400">SLA Breach Alert!</h3>
                <p className="text-sm text-red-600 dark:text-red-400/80">{stats.overdue} report(s) have been pending for more than 48 hours. Take action now.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart - Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Status Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" className="dark:stroke-slate-700" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3"
                  strokeDasharray={`${(stats.approved / (stats.total || 1)) * 100} ${100 - (stats.approved / (stats.total || 1)) * 100}`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3"
                  strokeDasharray={`${(stats.pending / (stats.total || 1)) * 100} ${100 - (stats.pending / (stats.total || 1)) * 100}`} strokeDashoffset={`-${(stats.approved / (stats.total || 1)) * 100}`} />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EF4444" strokeWidth="3"
                  strokeDasharray={`${(stats.rejected / (stats.total || 1)) * 100} ${100 - (stats.rejected / (stats.total || 1)) * 100}`} strokeDashoffset={`-${((stats.approved + stats.pending) / (stats.total || 1)) * 100}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-xs font-semibold">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>Approved</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>Pending</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>Rejected</span>
          </div>
        </div>

        {/* Bar Chart - Departments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">By Department</h3>
          <div className="space-y-3">
            {stats.deptBreakdown.slice(0, 5).map((dept) => (
              <div key={dept._id}>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  <span className="truncate max-w-[160px]">{dept._id || 'Unknown'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{dept.count}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-brand-btn to-brand-primary transition-all duration-500" style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {stats.deptBreakdown.length === 0 && <p className="text-sm text-slate-400 italic">No department data yet</p>}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Priority Breakdown</h3>
          <div className="space-y-3">
            {stats.priorityBreakdown.map((p) => (
              <div key={p._id} className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priorityColors[p._id] || '#94A3B8' }}></div>
                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{p._id}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{p.count}</span>
                <span className="text-xs text-slate-400 w-12 text-right">{((p.count / totalPriority) * 100).toFixed(0)}%</span>
              </div>
            ))}
            {stats.priorityBreakdown.length === 0 && <p className="text-sm text-slate-400 italic">No priority data yet</p>}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Reports + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">Recent Reports</h3>
            <span className="text-xs text-slate-400">Last {recentReports.length} reports</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                <tr>
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Submitter</th>
                  <th className="p-3 font-semibold">Vendor</th>
                  <th className="p-3 font-semibold">Priority</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {recentReports.map((r) => {
                  const ageHours = (Date.now() - new Date(r.createdAt)) / (1000 * 60 * 60);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 dark:text-white">{r.id}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{r.submittedBy}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{r.vendor}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                          r.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          r.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          r.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>{r.priority}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                            r.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            r.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>{r.status}</span>
                          {r.status === 'pending' && ageHours > 48 && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Overdue"></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {recentReports.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">No reports submitted yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center space-x-2">
            <Activity size={16} className="text-brand-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Live Activity</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto"></span>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
            {activity.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                  item.type === 'warning' ? 'bg-amber-500' :
                  item.type === 'success' ? 'bg-emerald-500' :
                  item.type === 'error' ? 'bg-red-500' : 'bg-brand-btn'
                }`}>
                  {item.type === 'warning' ? '⚠' : item.type === 'success' ? '✓' : item.type === 'error' ? '✗' : 'ℹ'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.createdAt)}</p>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8 italic">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
