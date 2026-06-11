import React, { useState, useEffect } from 'react';
import { Building2, AlertTriangle, TrendingUp, TrendingDown, ShieldOff, Shield, BarChart3 } from 'lucide-react';
import api from '../api';

const AdminVendors = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blacklist, setBlacklist] = useState(() => JSON.parse(localStorage.getItem('vendor-blacklist') || '[]'));
  const [compareList, setCompareList] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Build vendor scorecards from report data
  const vendors = React.useMemo(() => {
    const map = {};
    reports.forEach(r => {
      if (!r.vendor) return;
      if (!map[r.vendor]) map[r.vendor] = { name: r.vendor, total: 0, approved: 0, rejected: 0, pending: 0, critical: 0 };
      map[r.vendor].total++;
      if (r.status === 'approved') map[r.vendor].approved++;
      if (r.status === 'rejected') map[r.vendor].rejected++;
      if (r.status === 'pending') map[r.vendor].pending++;
      if (r.priority === 'critical') map[r.vendor].critical++;
    });
    return Object.values(map).map(v => {
      const defectRate = v.total > 0 ? ((v.rejected / v.total) * 100).toFixed(1) : 0;
      const riskScore = Math.min(100, Math.round((v.rejected * 3 + v.pending * 1.5 + v.critical * 5)));
      return { ...v, defectRate: parseFloat(defectRate), riskScore };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [reports]);

  const toggleBlacklist = (name) => {
    const next = blacklist.includes(name) ? blacklist.filter(n => n !== name) : [...blacklist, name];
    setBlacklist(next);
    localStorage.setItem('vendor-blacklist', JSON.stringify(next));
  };

  const toggleCompare = (name) => {
    setCompareList(prev => prev.includes(name) ? prev.filter(n => n !== name) : prev.length < 3 ? [...prev, name] : prev);
  };

  const getRiskColor = (score) => {
    if (score >= 60) return { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/30' };
    if (score >= 30) return { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/30' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30' };
  };

  const compareVendors = vendors.filter(v => compareList.includes(v.name));

  if (loading) return <div className="flex justify-center p-16"><div className="w-10 h-10 border-4 border-brand-btn/30 border-t-brand-btn rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Vendor Performance Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{vendors.length} vendors tracked from report data</p>
        </div>
        {compareList.length > 0 && (
          <button onClick={() => setCompareList([])} className="text-xs text-red-500 font-semibold hover:underline">Clear Comparison ({compareList.length})</button>
        )}
      </div>

      {/* Comparison Table */}
      {compareVendors.length >= 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-brand-btn/20 shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-brand-btn/5 dark:bg-brand-btn/10">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center"><BarChart3 size={16} className="mr-2 text-brand-btn" />Vendor Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                <tr>
                  <th className="p-3 font-semibold text-left">Metric</th>
                  {compareVendors.map(v => <th key={v.name} className="p-3 font-semibold text-center">{v.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {['total', 'approved', 'rejected', 'pending', 'critical', 'defectRate', 'riskScore'].map(metric => (
                  <tr key={metric} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300 capitalize">{metric === 'defectRate' ? 'Defect Rate %' : metric === 'riskScore' ? 'Risk Score' : metric}</td>
                    {compareVendors.map(v => {
                      const val = v[metric];
                      const isBest = metric === 'riskScore' ? val === Math.min(...compareVendors.map(x => x[metric])) : metric === 'defectRate' ? val === Math.min(...compareVendors.map(x => x[metric])) : val === Math.max(...compareVendors.map(x => x[metric]));
                      return <td key={v.name} className={`p-3 text-center font-bold ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{metric === 'defectRate' ? `${val}%` : val}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map(vendor => {
          const risk = getRiskColor(vendor.riskScore);
          const isBlacklisted = blacklist.includes(vendor.name);

          return (
            <div key={vendor.name} className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${isBlacklisted ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-slate-800'}`}>
              {/* Risk bar */}
              <div className={`h-1 ${risk.bg}`}></div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">{vendor.name}</h3>
                    {isBlacklisted && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-600 rounded-full dark:bg-red-900/30 dark:text-red-400">BLACKLISTED</span>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => toggleCompare(vendor.name)} className={`p-1 rounded-md transition-colors ${compareList.includes(vendor.name) ? 'bg-brand-btn/20 text-brand-btn' : 'text-slate-300 hover:text-brand-btn'}`} title="Compare">
                      <BarChart3 size={14} />
                    </button>
                    <button onClick={() => toggleBlacklist(vendor.name)} className={`p-1 rounded-md transition-colors ${isBlacklisted ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`} title={isBlacklisted ? 'Remove from blacklist' : 'Blacklist'}>
                      {isBlacklisted ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{vendor.total}</p>
                    <p className="text-xs text-slate-400 font-medium">Total</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{vendor.approved}</p>
                    <p className="text-xs text-slate-400 font-medium">Resolved</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-lg font-extrabold text-red-600 dark:text-red-400">{vendor.rejected}</p>
                    <p className="text-xs text-slate-400 font-medium">Rejected</p>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Risk Score</span>
                  <span className={`text-sm font-extrabold ${risk.text}`}>{vendor.riskScore}/100</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${risk.bg} transition-all duration-700`} style={{ width: `${vendor.riskScore}%` }}></div>
                </div>

                {/* Defect Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Defect Rate</span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-bold ${vendor.defectRate > 20 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{vendor.defectRate}%</span>
                    {vendor.defectRate > 20 ? <TrendingDown size={14} className="text-red-500" /> : <TrendingUp size={14} className="text-emerald-500" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {vendors.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium">No vendor data yet. Submit reports to see vendor analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendors;
