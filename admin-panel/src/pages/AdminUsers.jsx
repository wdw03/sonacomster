import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserX, Shield, Briefcase, TrendingUp, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, reportsRes] = await Promise.all([api.get('/users'), api.get('/reports')]);
      setUsers(usersRes.data);
      setReports(reportsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}`, { isActive: !currentStatus });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const getUserStats = (userName) => {
    const userReports = reports.filter(r => r.submittedBy === userName);
    const total = userReports.length;
    const approved = userReports.filter(r => r.status === 'approved').length;
    const rejected = userReports.filter(r => r.status === 'rejected').length;
    const pending = userReports.filter(r => r.status === 'pending').length;
    const rate = total > 0 ? ((approved / total) * 100).toFixed(0) : 0;
    return { total, approved, rejected, pending, rate };
  };

  const getBadge = (rate) => {
    if (rate >= 80) return { label: '⭐ Top Performer', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
    if (rate >= 50) return { label: '✅ Good', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
    return { label: '⚠️ Needs Review', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  };

  if (loading) return <div className="flex justify-center p-16"><div className="w-10 h-10 border-4 border-brand-btn/30 border-t-brand-btn rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Employee Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} registered employees</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <Users size={20} className="text-brand-btn mb-2" />
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{users.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Employees</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <Shield size={20} className="text-brand-primary mb-2" />
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{users.filter(u => u.role === 'Admin').length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admins</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <CheckCircle size={20} className="text-emerald-500 mb-2" />
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{users.filter(u => u.isActive !== false).length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <UserX size={20} className="text-red-500 mb-2" />
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{users.filter(u => u.isActive === false).length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inactive</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Role & Dept</th>
                <th className="p-4 font-semibold">Reports</th>
                <th className="p-4 font-semibold">Approval Rate</th>
                <th className="p-4 font-semibold">Performance</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {users.map(user => {
                const stats = getUserStats(user.name);
                const badge = getBadge(stats.rate);

                return (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-btn flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden">
                          {user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" /> : user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{user.role}</p>
                      <p className="text-xs text-slate-400 flex items-center mt-0.5"><Briefcase size={10} className="mr-1" />{user.department}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{stats.total}</p>
                      <p className="text-xs text-slate-400">{stats.pending} pending</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${stats.rate >= 80 ? 'bg-emerald-500' : stats.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stats.rate}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{stats.rate}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {stats.total > 0 ? (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${badge.color}`}>{badge.label}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No data</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${user.isActive === false ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {user.isActive === false ? 'INACTIVE' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.employeeId !== 'admin' && (
                        <button onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`p-2 rounded-lg transition-colors text-xs font-semibold ${user.isActive === false ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'}`}>
                          {user.isActive === false ? 'Activate' : 'Deactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
