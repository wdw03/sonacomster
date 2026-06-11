import React, { useState, useEffect, useMemo } from 'react';
import { Download, Search, Filter, CheckCircle, XCircle, AlertCircle, MessageSquare, ArrowRight, Star, StarOff, Tag, Maximize2, Minimize2, Clock, Eye, Printer } from 'lucide-react';
import api from '../api';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost ? 'http://localhost:5000' : 'http://13.203.210.179:5000';
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');
  const [selectedReport, setSelectedReport] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [capaAction, setCapaAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [adminImageFile, setAdminImageFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('admin-bookmarks') || '[]'));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [quickReply, setQuickReply] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [bulkAction, setBulkAction] = useState('');

  const stages = ['Pending', 'Under Investigation', 'CAPA Assigned', 'Resolved'];
  const quickReplies = ['Under review', 'Need more info from submitter', 'Assigned to QC team', 'Issue confirmed - investigating', 'Vendor has been notified', 'CAPA action assigned'];

  useEffect(() => {
    fetchReports();

    const handleCloseModals = () => {
      setSelectedReport(null);
      setLightboxImage(null);
    };
    window.addEventListener('close-modals', handleCloseModals);
    return () => window.removeEventListener('close-modals', handleCloseModals);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Filters
  const filtered = useMemo(() => {
    let data = [...reports];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r => r.id?.toLowerCase().includes(q) || r.submittedBy?.toLowerCase().includes(q) || r.vendor?.toLowerCase().includes(q) || r.defectType?.toLowerCase().includes(q) || r.department?.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') data = data.filter(r => r.status === statusFilter);
    if (priorityFilter !== 'all') data = data.filter(r => r.priority === priorityFilter);
    // Bookmarked first
    data.sort((a, b) => (bookmarks.includes(b.id) ? 1 : 0) - (bookmarks.includes(a.id) ? 1 : 0));
    return data;
  }, [reports, searchQuery, statusFilter, priorityFilter, bookmarks]);

  const toggleBookmark = (id) => {
    const next = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('admin-bookmarks', JSON.stringify(next));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(r => r.id));
  };

  const handleUpdateStatus = async (status) => {
    try {
      let uploadedImageUrls = [];
      if (adminImageFile) {
        const formData = new FormData();
        formData.append('image', adminImageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrls.push(uploadRes.data.imageUrl);
      }

      await api.put(`/reports/${selectedReport.id}/status`, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        capaAction: capaAction || undefined,
        adminRemarks: adminRemarks || undefined,
        adminImages: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined
      });
      setSelectedReport(null);
      setCapaAction('');
      setRejectionReason('');
      setAdminRemarks('');
      setAdminImageFile(null);
      fetchReports();
    } catch (err) { console.error(err); }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await api.put(`/reports/${id}/status`, { status: bulkAction });
      }
      setSelectedIds([]); setBulkAction('');
      fetchReports();
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async () => {
    const text = newComment || quickReply;
    if (!text.trim()) return;
    try {
      await api.post(`/reports/${selectedReport.id}/comment`, { text });
      setNewComment(''); setQuickReply('');
      const res = await api.get('/reports');
      setReports(res.data);
      const updated = res.data.find(r => r.id === selectedReport.id);
      if (updated) setSelectedReport(updated);
    } catch (err) { console.error(err); }
  };

  const handleStageChange = async (reportId, newStage) => {
    try {
      await api.put(`/reports/${reportId}/stage`, { kanbanStage: newStage });
      fetchReports();
    } catch (err) { console.error(err); }
  };

  const exportCSV = (data) => {
    const headers = ['ID', 'Item', 'Vendor', 'Priority', 'Status', 'Stage', 'Submitter', 'Email', 'Department', 'Date', 'Defect Type', 'Quantity', 'Description', 'Rejection Reason', 'Admin Remarks', 'CAPA Action', 'Reviewed By', 'Comments Count'];
    const esc = (v) => `"${(v || '').toString().replace(/"/g, '""')}"`;
    const rows = data.map(r => [
      esc(r.id), esc(r.item), esc(r.vendor), esc(r.priority), esc(r.status),
      esc(r.kanbanStage || 'Pending'), esc(r.submittedBy), esc(r.submitterEmail),
      esc(r.department), esc(r.date), esc(r.defectType), esc(r.qty),
      esc(r.description), esc(r.rejectionReason), esc(r.adminRemarks),
      esc(r.capaAction), esc(r.reviewedBy), (r.comments || []).length
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `Reports_Export_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const printReport = (report) => {
    const win = window.open('', '_blank');
    const statusColor = report.status === 'approved' ? '#059669' : report.status === 'rejected' ? '#dc2626' : '#d97706';
    const statusBg = report.status === 'approved' ? '#ecfdf5' : report.status === 'rejected' ? '#fef2f2' : '#fffbeb';

    const userImagesHtml = (report.images || []).map(img => `
      <div style="display:inline-block;margin:6px;">
        <img src="${getImageUrl(img)}" style="width:180px;height:180px;object-fit:cover;border-radius:12px;border:2px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />
      </div>
    `).join('');

    const adminImagesHtml = (report.adminImages || []).map(img => `
      <div style="display:inline-block;margin:6px;">
        <img src="${getImageUrl(img)}" style="width:180px;height:180px;object-fit:cover;border-radius:12px;border:2px solid #3b82f6;box-shadow:0 2px 8px rgba(59,130,246,0.2);" />
      </div>
    `).join('');

    const commentsHtml = (report.comments || []).map(c => `
      <div style="padding:10px 14px;margin-bottom:8px;border-radius:12px;background:${c.role === 'Admin' ? '#f0f9ff' : '#f8fafc'};border-left:3px solid ${c.role === 'Admin' ? '#3b82f6' : '#94a3b8'};">
        <div style="font-size:11px;font-weight:700;color:${c.role === 'Admin' ? '#1d4ed8' : '#64748b'};margin-bottom:4px;">${c.user || 'User'} ${c.role === 'Admin' ? '(Admin)' : ''} &middot; ${c.date || ''}</div>
        <div style="font-size:13px;color:#334155;">${c.text}</div>
      </div>
    `).join('');

    win.document.write(`<html><head><title>Report ${report.id} - SONACOMSTAR Admin</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #1e293b; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #DF0E6B; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 22px; color: #0f172a; font-weight: 800; }
        .header .brand { font-size: 14px; color: #DF0E6B; font-weight: 700; letter-spacing: 0.05em; }
        .header .report-id { font-size: 13px; background: #DF0E6B; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: 700; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
        .grid { display: flex; gap: 16px; flex-wrap: wrap; }
        .grid-item { flex: 1; min-width: 140px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
        .grid-item .label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
        .grid-item .value { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .alert-box { padding: 14px 18px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid; }
        .images-grid { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
        .desc-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; font-size: 14px; color: #334155; }
        .footer { margin-top: 30px; padding-top: 16px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div><div class="brand">SONACOMSTAR ADMIN</div><h1>Quality Inspection Report</h1></div>
        <div style="text-align:right;"><span class="report-id">${report.id}</span><div style="font-size:12px;color:#64748b;margin-top:6px;">${report.submittedDate || report.date || ''}</div></div>
      </div>
      <div class="section"><div class="section-title">Report Details</div>
        <div class="grid">
          <div class="grid-item"><div class="label">Submitter</div><div class="value">${report.submittedBy || 'N/A'}</div></div>
          <div class="grid-item"><div class="label">Email</div><div class="value">${report.submitterEmail || 'N/A'}</div></div>
          <div class="grid-item"><div class="label">Department</div><div class="value">${report.department || 'N/A'}</div></div>
          <div class="grid-item"><div class="label">Vendor</div><div class="value">${report.vendor || 'N/A'}</div></div>
        </div>
      </div>
      <div class="section"><div class="grid">
        <div class="grid-item"><div class="label">Item</div><div class="value">${report.item || 'N/A'}</div></div>
        <div class="grid-item"><div class="label">Defect Type</div><div class="value">${report.defectType || 'N/A'}</div></div>
        <div class="grid-item"><div class="label">Priority</div><div class="value" style="text-transform:capitalize;color:${report.priority === 'critical' ? '#dc2626' : '#0f172a'}">${report.priority || 'N/A'}</div></div>
        <div class="grid-item"><div class="label">Qty</div><div class="value">${report.qty || 'N/A'}</div></div>
        <div class="grid-item"><div class="label">Stage</div><div class="value">${report.kanbanStage || 'Pending'}</div></div>
      </div></div>
      <div class="section"><div class="section-title">Description</div><div class="desc-box">${report.description || 'No description provided.'}</div></div>
      <div class="section"><div class="section-title">Status & Decision</div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span class="status-badge" style="background:${statusBg};color:${statusColor};border:1px solid ${statusColor}30;">${(report.status || 'pending').toUpperCase()}</span>
          ${report.reviewedBy ? `<span style="font-size:12px;color:#64748b;">Reviewed by <strong>${report.reviewedBy}</strong> on ${report.reviewDate || ''}</span>` : ''}
        </div>
        ${report.status === 'rejected' && report.rejectionReason ? `<div class="alert-box" style="background:#fef2f2;border-color:#dc2626;"><div style="font-size:11px;font-weight:700;color:#dc2626;text-transform:uppercase;margin-bottom:4px;">Rejection Reason</div><div style="font-size:13px;color:#991b1b;">${report.rejectionReason}</div></div>` : ''}
        ${report.adminRemarks ? `<div class="alert-box" style="background:${report.status === 'approved' ? '#ecfdf5' : '#f0f9ff'};border-color:${report.status === 'approved' ? '#059669' : '#3b82f6'};"><div style="font-size:11px;font-weight:700;color:${report.status === 'approved' ? '#059669' : '#1d4ed8'};text-transform:uppercase;margin-bottom:4px;">${report.status === 'approved' ? 'Approval Remarks' : 'Admin Remarks'}</div><div style="font-size:13px;color:#334155;">${report.adminRemarks}</div></div>` : ''}
        ${report.capaAction ? `<div class="alert-box" style="background:#faf5ff;border-color:#7c3aed;"><div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;margin-bottom:4px;">CAPA Action</div><div style="font-size:13px;color:#334155;">${report.capaAction}</div></div>` : ''}
      </div>
      ${userImagesHtml ? `<div class="section"><div class="section-title">User Attachments (${(report.images || []).length})</div><div class="images-grid">${userImagesHtml}</div></div>` : ''}
      ${adminImagesHtml ? `<div class="section"><div class="section-title">Admin Verification Images (${(report.adminImages || []).length})</div><div class="images-grid">${adminImagesHtml}</div></div>` : ''}
      ${commentsHtml ? `<div class="section"><div class="section-title">Conversation Thread (${(report.comments || []).length} messages)</div>${commentsHtml}</div>` : ''}
      <div class="footer"><div style="font-weight:700;color:#DF0E6B;">SONACOMSTAR Quality Management System</div><div>Generated on ${new Date().toLocaleString()} &bull; Report ${report.id} &bull; Admin Panel</div></div>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const getAgeBadge = (createdAt) => {
    const hours = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);
    if (hours > 72) return <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full animate-pulse dark:bg-red-900/30 dark:text-red-400">CRITICAL</span>;
    if (hours > 48) return <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-600 rounded-full dark:bg-amber-900/30 dark:text-amber-400">OVERDUE</span>;
    return null;
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-4 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">All Employee Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} reports found</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setView(view === 'table' ? 'kanban' : 'table')} className="px-3 py-2 text-xs font-semibold border-2 border-brand-btn text-brand-btn dark:text-brand-btn rounded-xl hover:bg-brand-btn/10 transition-colors">
            {view === 'table' ? '🗂 Kanban' : '📋 Table'}
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-2 text-xs font-semibold border border-gray-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={() => exportCSV(selectedIds.length > 0 ? reports.filter(r => selectedIds.includes(r.id)) : filtered)} className="px-3 py-2 text-xs font-semibold bg-brand-btn text-white rounded-xl hover:opacity-90 flex items-center space-x-1 shadow-md">
            <Download size={14} /><span>Export {selectedIds.length > 0 ? `(${selectedIds.length})` : 'All'}</span>
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search reports, vendors, employees..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-btn/50 text-slate-800 dark:text-white placeholder:text-slate-400" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Filter size={14} /><span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none">
              <option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none">
              <option value="all">All Priority</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
            <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPriorityFilter('all'); }} className="text-xs text-brand-primary font-semibold hover:underline">Clear All</button>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-brand-btn/5 dark:bg-brand-btn/10 rounded-xl border border-brand-btn/20">
            <span className="text-sm font-semibold text-brand-btn">{selectedIds.length} selected</span>
            <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-slate-700 dark:text-slate-300">
              <option value="">Bulk Action...</option><option value="approved">Approve All</option><option value="rejected">Reject All</option>
            </select>
            <button onClick={handleBulkAction} disabled={!bulkAction} className="px-3 py-1.5 text-xs font-bold bg-brand-btn text-white rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity">Apply</button>
            <button onClick={() => setSelectedIds([])} className="text-xs text-red-500 font-semibold hover:underline">Clear</button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-16"><div className="w-10 h-10 border-4 border-brand-btn/30 border-t-brand-btn rounded-full animate-spin"></div></div>
      ) : view === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 w-8"><input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded" /></th>
                  <th className="p-3 w-8">★</th>
                  <th className="p-3 font-semibold">Report ID</th>
                  <th className="p-3 font-semibold">Employee</th>
                  <th className="p-3 font-semibold">Vendor</th>
                  <th className="p-3 font-semibold">Defect</th>
                  <th className="p-3 font-semibold">Priority</th>
                  <th className="p-3 font-semibold">Stage</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {filtered.map((r) => (
                  <tr key={r.id} className={`hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${selectedIds.includes(r.id) ? 'bg-brand-btn/5 dark:bg-brand-btn/10' : ''}`}>
                    <td className="p-3"><input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} className="rounded" /></td>
                    <td className="p-3"><button onClick={() => toggleBookmark(r.id)} className="text-slate-300 hover:text-amber-500 transition-colors">{bookmarks.includes(r.id) ? <Star size={16} className="text-amber-500 fill-amber-500" /> : <StarOff size={16} />}</button></td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-white">
                      {r.id}
                      {r.status === 'pending' && getAgeBadge(r.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{r.submittedBy}</div>
                      <div className="text-xs text-slate-400">{r.submitterEmail || r.department}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{r.vendor}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-[120px] truncate">{r.defectType}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${r.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        r.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          r.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>{r.priority}</span>
                    </td>
                    <td className="p-3">
                      <select value={r.kanbanStage || 'Pending'} onChange={(e) => handleStageChange(r.id, e.target.value)}
                        className="text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-1 outline-none text-slate-700 dark:text-slate-300">
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>{r.status}</span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => setSelectedReport(r)} className="p-1.5 bg-brand-btn/10 text-brand-btn rounded-lg hover:bg-brand-btn hover:text-white transition-colors" title="Review">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageReports = filtered.filter(r => (r.kanbanStage || 'Pending') === stage);
            return (
              <div key={stage} className="w-72 flex-shrink-0 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{stage}</h3>
                    <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">{stageReports.length}</span>
                  </div>
                </div>
                <div className="p-3 flex-1 space-y-2 min-h-[350px] max-h-[500px] overflow-y-auto">
                  {stageReports.map(r => (
                    <div key={r.id} onClick={() => setSelectedReport(r)} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 cursor-pointer hover:border-brand-btn/50 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{r.id}</span>
                        <span className={`w-2 h-2 rounded-full ${r.priority === 'critical' ? 'bg-red-500' : r.priority === 'high' ? 'bg-amber-500' : 'bg-brand-btn'}`}></span>
                      </div>
                      <p className="text-xs font-medium text-brand-primary mb-0.5">{r.vendor}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.description}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{r.submittedBy}</span>
                        <div className="flex items-center"><MessageSquare size={10} className="mr-0.5" />{r.comments?.length || 0}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" data-modal>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up border border-gray-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Report {selectedReport.id}</h2>
                <p className="text-xs text-slate-500">{selectedReport.submittedBy} • {selectedReport.submitterEmail || 'No email'} • {selectedReport.department}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => printReport(selectedReport)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Print"><Printer size={18} className="text-slate-500" /></button>
                <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"><XCircle size={20} className="text-slate-400" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              {/* Left: Details + Timeline + Actions */}
              <div className="p-5 md:w-1/2 space-y-5 border-r border-gray-100 dark:border-slate-800 overflow-y-auto">
                {/* Details */}
                <div className="space-y-3">
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Description</p><p className="text-sm text-slate-800 dark:text-slate-200 mt-1">{selectedReport.description}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Vendor</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.vendor}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Defect</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.defectType}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Priority</p><p className="text-sm font-semibold capitalize text-slate-800 dark:text-white">{selectedReport.priority}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Quantity</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.qty}</p></div>
                  </div>
                </div>

                {/* Image Gallery */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Attachments ({selectedReport.images.length})</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedReport.images.map((img, i) => (
                        <div key={i} className="relative group w-24 h-24 flex-shrink-0">
                          <img src={getImageUrl(img)} alt={`Attachment ${i + 1}`}
                            className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            <button onClick={() => setLightboxImage(getImageUrl(img))} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors" title="View">
                              <Eye size={16} />
                            </button>
                            <a href={getImageUrl(img)} download target="_blank" rel="noreferrer" className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors" title="Download">
                              <Download size={16} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Image Gallery */}
                {selectedReport.adminImages && selectedReport.adminImages.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-brand-primary uppercase mb-2">My Fix/Verification Images</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedReport.adminImages.map((img, i) => (
                        <div key={i} className="relative group w-24 h-24 flex-shrink-0">
                          <img src={getImageUrl(img)} alt={`Admin Attachment ${i + 1}`}
                            className="w-full h-full object-cover rounded-xl border-2 border-brand-primary shadow-sm" />
                          <div className="absolute inset-0 bg-brand-primary/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            <button onClick={() => setLightboxImage(getImageUrl(img))} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors" title="View">
                              <Eye size={16} />
                            </button>
                            <a href={getImageUrl(img)} download target="_blank" rel="noreferrer" className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors" title="Download">
                              <Download size={16} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">Audit Timeline</p>
                  <div className="space-y-3 border-l-2 border-gray-200 dark:border-slate-700 pl-4 ml-2">
                    <div className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-brand-btn border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Report Created</p><p className="text-xs text-slate-400">{selectedReport.submittedDate} by {selectedReport.submittedBy}</p></div>
                    {selectedReport.reviewedBy && <div className="relative"><div className={`absolute -left-[22px] top-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${selectedReport.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'}`}></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status: {selectedReport.status}</p><p className="text-xs text-slate-400">{selectedReport.reviewDate} by {selectedReport.reviewedBy}</p></div>}
                    {selectedReport.capaAction && <div className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">CAPA Assigned</p><p className="text-xs text-slate-400">{selectedReport.capaAction}</p></div>}
                    {(selectedReport.comments || []).map((c, i) => (
                      <div key={i} className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-blue-400 border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Comment by {c.user}</p><p className="text-xs text-slate-400">{c.text}</p></div>
                    ))}
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedReport.status === 'pending' && (
                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Admin Actions</p>
                    <input type="text" value={adminRemarks} onChange={(e) => setAdminRemarks(e.target.value)} placeholder="Remarks / Feedback for user..." className="w-full p-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-btn text-slate-800 dark:text-white placeholder:text-slate-400" />
                    <input type="text" value={capaAction} onChange={(e) => setCapaAction(e.target.value)} placeholder="CAPA / Corrective Action..." className="w-full p-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-btn text-slate-800 dark:text-white placeholder:text-slate-400" />
                    <input type="text" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Rejection reason (if rejecting)..." className="w-full p-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-btn text-slate-800 dark:text-white placeholder:text-slate-400" />
                    <div className="flex items-center space-x-2 mb-2">
                      <label className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold">
                        <span>Upload Fix Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setAdminImageFile(e.target.files[0])} />
                      </label>
                      {adminImageFile && <span className="text-xs text-brand-primary truncate max-w-[150px]">{adminImageFile.name}</span>}
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => handleUpdateStatus('approved')} className="flex-1 py-2.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-500/20 transition-colors flex items-center justify-center space-x-1.5 text-sm">
                        <CheckCircle size={16} /><span>Approve</span>
                      </button>
                      <button onClick={() => handleUpdateStatus('rejected')} className="flex-1 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center space-x-1.5 text-sm">
                        <AlertCircle size={16} /><span>Reject</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Chat */}
              <div className="p-5 md:w-1/2 bg-gray-50 dark:bg-slate-950 flex flex-col">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center text-sm"><MessageSquare size={16} className="mr-2 text-brand-primary" />Discussion</h3>

                <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[350px]">
                  {(!selectedReport.comments || selectedReport.comments.length === 0) ? (
                    <p className="text-sm text-slate-400 italic text-center mt-12">No messages yet. Start a discussion below.</p>
                  ) : (
                    selectedReport.comments.map((c, i) => (
                      <div key={i} className={`flex flex-col ${c.role === 'Admin' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${c.role === 'Admin' ? 'bg-gradient-to-r from-brand-btn to-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                          <p className="text-xs font-bold mb-1 opacity-70">{c.user} ({c.role})</p>
                          <p>{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Replies */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {quickReplies.map((qr) => (
                    <button key={qr} onClick={() => { setNewComment(qr); }} className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-brand-btn/10 hover:border-brand-btn/30 transition-colors">
                      {qr}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddComment()} placeholder="Type a message..."
                    className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-brand-btn text-sm text-slate-800 dark:text-white placeholder:text-slate-400" />
                  <button onClick={handleAddComment} className="p-3 bg-gradient-to-r from-brand-btn to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-md">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-8 animate-fade-in" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Full view" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          <div className="absolute top-6 right-6 flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
            <a href={lightboxImage} download target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors" title="Download Image">
              <Download size={20} />
            </a>
            <button onClick={() => setLightboxImage(null)} className="bg-white/10 hover:bg-red-500/80 p-2 rounded-full text-white transition-colors" title="Close">
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
