import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      for (const n of notifications.filter(n => !n.isRead)) {
        await api.put(`/notifications/${n._id}/read`);
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications.filter(n => n.type === filter);

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-brand-btn" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'warning': return 'bg-amber-100 dark:bg-amber-900/30';
      case 'success': return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'error': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="flex justify-center p-16"><div className="w-10 h-10 border-4 border-brand-btn/30 border-t-brand-btn rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-4 py-2 text-xs font-semibold bg-brand-btn/10 text-brand-btn rounded-xl hover:bg-brand-btn/20 transition-colors flex items-center space-x-1.5">
            <CheckCheck size={14} /><span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'unread', 'warning', 'success', 'error', 'info'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors capitalize ${
              filter === f ? 'bg-brand-btn text-white shadow-md' : 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}>
            {f === 'all' ? `All (${notifications.length})` : f === 'unread' ? `Unread (${unreadCount})` : f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.map((n) => (
          <div key={n._id}
            className={`flex items-start space-x-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
              n.isRead
                ? 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800'
                : 'bg-brand-btn/5 dark:bg-brand-btn/10 border-brand-btn/20 dark:border-brand-btn/30'
            }`}
            onClick={() => !n.isRead && markAsRead(n._id)}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBg(n.type)}`}>
              {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <p className={`text-sm font-semibold ${n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{n.title}</p>
                {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-brand-btn flex-shrink-0 mt-1.5"></span>}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
              <p className="text-[10px] text-slate-400 mt-1.5">{timeAgo(n.createdAt)}{n.link && <span className="ml-2 text-brand-btn font-semibold">→ {n.link}</span>}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
