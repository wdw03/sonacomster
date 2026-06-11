import React, { useState, useEffect } from 'react';
import {
  Search, Download, Filter, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, ExternalLink, FileText,
  CheckCircle, XCircle, Clock, AlertCircle, X, Printer, MessageSquare, ArrowRight
} from 'lucide-react';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost ? 'http://localhost:5000' : 'http://13.203.210.179:5000';
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

const MyReports = ({ setActiveTab }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const itemsPerPage = 5;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-open modal if requested from Dashboard
  useEffect(() => {
    const viewId = localStorage.getItem('viewReportId');
    if (viewId && reports.length > 0) {
      const report = reports.find(r => r.id === viewId);
      if (report) {
        setSelectedReport(report);
        setShowDetailsModal(true);
        localStorage.removeItem('viewReportId');
      }
    }
  }, [reports]);

  useEffect(() => {
    fetchReports();
  }, [filter, searchTerm]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { default: api } = await import('../api.js');
      const response = await api.get('/reports', {
        params: { status: filter, search: searchTerm }
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleCloseModals = () => {
      setShowDetailsModal(false);
      setSelectedReport(null);
      setLightboxImage(null);
    };
    window.addEventListener('close-modals', handleCloseModals);
    return () => window.removeEventListener('close-modals', handleCloseModals);
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedReport) return;
    try {
      const { default: api } = await import('../api.js');
      await api.post(`/reports/${selectedReport.id}/comment`, { text: newComment });
      setNewComment('');
      
      const response = await api.get('/reports', {
        params: { status: filter, search: searchTerm }
      });
      setReports(response.data);
      const updated = response.data.find(r => r.id === selectedReport.id);
      if (updated) setSelectedReport(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const printReport = (report) => {
    const win = window.open('', '_blank');
    const imgUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${API_BASE_URL}${path}`;
    };
    const statusColor = report.status === 'approved' ? '#059669' : report.status === 'rejected' ? '#dc2626' : '#d97706';
    const statusBg = report.status === 'approved' ? '#ecfdf5' : report.status === 'rejected' ? '#fef2f2' : '#fffbeb';

    const userImagesHtml = (report.images || []).map(img => `
      <div style="display:inline-block;margin:6px;">
        <img src="${imgUrl(img)}" style="width:180px;height:180px;object-fit:cover;border-radius:12px;border:2px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />
      </div>
    `).join('');

    const adminImagesHtml = (report.adminImages || []).map(img => `
      <div style="display:inline-block;margin:6px;">
        <img src="${imgUrl(img)}" style="width:180px;height:180px;object-fit:cover;border-radius:12px;border:2px solid #3b82f6;box-shadow:0 2px 8px rgba(59,130,246,0.2);" />
      </div>
    `).join('');

    const commentsHtml = (report.comments || []).map(c => `
      <div style="padding:10px 14px;margin-bottom:8px;border-radius:12px;background:${c.role === 'Admin' ? '#f0f9ff' : '#f8fafc'};border-left:3px solid ${c.role === 'Admin' ? '#3b82f6' : '#94a3b8'};">
        <div style="font-size:11px;font-weight:700;color:${c.role === 'Admin' ? '#1d4ed8' : '#64748b'};margin-bottom:4px;">${c.user || 'User'} ${c.role === 'Admin' ? '(Admin)' : ''} &middot; ${c.date || ''}</div>
        <div style="font-size:13px;color:#334155;">${c.text}</div>
      </div>
    `).join('');

    win.document.write(`
      <html>
        <head>
          <title>Report ${report.id} - SONACOMSTAR Quality Report</title>
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
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">SONACOMSTAR</div>
              <h1>Quality Inspection Report</h1>
            </div>
            <div style="text-align:right;">
              <span class="report-id">${report.id}</span>
              <div style="font-size:12px;color:#64748b;margin-top:6px;">${report.submittedDate || report.date || ''}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Report Details</div>
            <div class="grid">
              <div class="grid-item"><div class="label">Submitter</div><div class="value">${report.submittedBy || 'N/A'}</div></div>
              <div class="grid-item"><div class="label">Department</div><div class="value">${report.department || 'N/A'}</div></div>
              <div class="grid-item"><div class="label">Vendor</div><div class="value">${report.vendor || 'N/A'}</div></div>
              <div class="grid-item"><div class="label">Item</div><div class="value">${report.item || 'N/A'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="grid">
              <div class="grid-item"><div class="label">Defect Type</div><div class="value">${report.defectType || 'N/A'}</div></div>
              <div class="grid-item"><div class="label">Priority</div><div class="value" style="text-transform:capitalize;color:${report.priority === 'critical' ? '#dc2626' : '#0f172a'}">${report.priority || 'N/A'}</div></div>
              <div class="grid-item"><div class="label">Quantity</div><div class="value">${report.qty || 'N/A'}</div></div>
              <div class="grid-item"><div class="label">Stage</div><div class="value">${report.kanbanStage || 'Pending'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Description</div>
            <div class="desc-box">${report.description || 'No description provided.'}</div>
          </div>

          <div class="section">
            <div class="section-title">Status & Decision</div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <span class="status-badge" style="background:${statusBg};color:${statusColor};border:1px solid ${statusColor}30;">${(report.status || 'pending').toUpperCase()}</span>
              ${report.reviewedBy ? `<span style="font-size:12px;color:#64748b;">Reviewed by <strong>${report.reviewedBy}</strong> on ${report.reviewDate || ''}</span>` : ''}
            </div>
            ${report.status === 'rejected' && report.rejectionReason ? `
              <div class="alert-box" style="background:#fef2f2;border-color:#dc2626;">
                <div style="font-size:11px;font-weight:700;color:#dc2626;text-transform:uppercase;margin-bottom:4px;">Rejection Reason</div>
                <div style="font-size:13px;color:#991b1b;">${report.rejectionReason}</div>
              </div>` : ''}
            ${report.adminRemarks ? `
              <div class="alert-box" style="background:${report.status === 'approved' ? '#ecfdf5' : '#f0f9ff'};border-color:${report.status === 'approved' ? '#059669' : '#3b82f6'};">
                <div style="font-size:11px;font-weight:700;color:${report.status === 'approved' ? '#059669' : '#1d4ed8'};text-transform:uppercase;margin-bottom:4px;">${report.status === 'approved' ? 'Approval Remarks' : 'Admin Remarks'}</div>
                <div style="font-size:13px;color:#334155;">${report.adminRemarks}</div>
              </div>` : ''}
            ${report.capaAction ? `
              <div class="alert-box" style="background:#faf5ff;border-color:#7c3aed;">
                <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;margin-bottom:4px;">CAPA Action</div>
                <div style="font-size:13px;color:#334155;">${report.capaAction}</div>
              </div>` : ''}
          </div>

          ${userImagesHtml ? `
          <div class="section">
            <div class="section-title">User Attachments (${(report.images || []).length})</div>
            <div class="images-grid">${userImagesHtml}</div>
          </div>` : ''}

          ${adminImagesHtml ? `
          <div class="section">
            <div class="section-title">Admin Verification Images (${(report.adminImages || []).length})</div>
            <div class="images-grid">${adminImagesHtml}</div>
          </div>` : ''}

          ${commentsHtml ? `
          <div class="section">
            <div class="section-title">Conversation Thread (${(report.comments || []).length} messages)</div>
            ${commentsHtml}
          </div>` : ''}

          <div class="footer">
            <div style="font-weight:700;color:#DF0E6B;">SONACOMSTAR Quality Management System</div>
            <div>Generated on ${new Date().toLocaleString()} &bull; Report ${report.id}</div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const handleExport = () => {
    const headers = ['ID', 'Item', 'Vendor', 'Priority', 'Status', 'Stage', 'Department', 'Date', 'Defect Type', 'Quantity', 'Description', 'Rejection Reason', 'Admin Remarks', 'CAPA Action', 'Comments Count'];
    const esc = (v) => `"${(v || '').toString().replace(/"/g, '""')}"`;
    const rows = reports.map(r => [
      esc(r.id), esc(r.item), esc(r.vendor), esc(r.priority), esc(r.status),
      esc(r.kanbanStage || 'Pending'), esc(r.department), esc(r.date),
      esc(r.defectType), esc(r.qty), esc(r.description),
      esc(r.rejectionReason), esc(r.adminRemarks), esc(r.capaAction),
      (r.comments || []).length
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `My_Reports_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const filteredReports = reports;

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Statistics
  const stats = [
    { label: 'Total Reports', value: reports.length, color: 'blue' },
    { label: 'Pending', value: reports.filter(r => r.status === 'pending').length, color: 'amber' },
    { label: 'Approved', value: reports.filter(r => r.status === 'approved').length, color: 'green' },
    { label: 'Rejected', value: reports.filter(r => r.status === 'rejected').length, color: 'red' },
  ];

  const statColors = {
    blue: 'text-brand-primary',
    amber: 'text-brand-primary',
    green: 'text-brand-primary',
    red: 'text-brand-primary',
  };

  const priorityColors = {
    critical: 'bg-brand-primary/20 text-brand-primary',
    high: 'bg-brand-primary/10 text-brand-primary',
    medium: 'bg-brand-btn/10 text-brand-primary',
    low: 'bg-brand-secondary/10 text-brand-secondary',
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const { default: api } = await import('../api.js');
        await api.delete(`/reports/${id}`);
        alert(`Report ${id} deleted successfully!`);
        fetchReports(); // Refresh list
      } catch (error) {
        console.error("Error deleting report:", error);
        alert("Failed to delete report.");
      }
    }
  };


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">My Quality Reports</h1>
          <p className="text-brand-secondary mt-2">Track and manage all your submitted quality reports</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2.5 bg-brand-btn text-white rounded-xl hover:from-blue-700 hover: transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Download size={18} />
            <span>Export Excel</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 border-2 border-brand-btn text-brand-primary rounded-xl hover:bg-brand-btn/10 transition-all duration-300">
            <Filter size={18} />
            <span>Advanced Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm text-brand-secondary">{stat.label}</p>
            <p className={`text-2xl md:text-3xl font-bold mt-2 ${statColors[stat.color]}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports by ID, item, vendor, or defect type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${filter === status
                  ? 'bg-brand-btn text-white shadow-sm'
                  : 'bg-gray-100 text-brand-primary hover:bg-gray-200'
                  }`}
              >
                {status === 'all' ? 'All Reports' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden w-full">
        {/* Reports Table - Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[900px] flex flex-col w-full">
            {/* Table Header */}
            <div className="flex bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <div className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-brand-primary dark:text-white uppercase tracking-wider">Report ID</div>
              <div className="w-[25%] px-6 py-4 text-left text-xs font-semibold text-brand-primary dark:text-white uppercase tracking-wider">Item Details</div>
              <div className="w-[15%] hidden lg:block px-6 py-4 text-left text-xs font-semibold text-brand-primary dark:text-white uppercase tracking-wider">Department</div>
              <div className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-brand-primary dark:text-white uppercase tracking-wider">Defect Type</div>
              <div className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-brand-primary dark:text-white uppercase tracking-wider">Status</div>
              <div className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-brand-primary dark:text-white uppercase tracking-wider">Actions</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col w-full">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <div key={report.id} className="flex border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200 items-center">
                    <div className="w-[15%] px-6 py-4">
                      <div className="font-mono font-bold text-brand-primary dark:text-white">{report.id}</div>
                      <div className="text-xs text-brand-secondary dark:text-slate-400 mt-1">{report.date}</div>
                    </div>
                    
                    <div className="w-[25%] px-6 py-4">
                      <div className="font-medium text-brand-primary dark:text-white">{report.item}</div>
                      <div className="text-sm text-brand-secondary dark:text-slate-400">{report.vendor} • Qty: {report.qty}</div>
                      <div className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[report.priority]}`}>
                        {report.priority}
                      </div>
                    </div>
                    
                    <div className="w-[15%] hidden lg:block px-6 py-4">
                      <div className="text-sm text-brand-primary dark:text-white">{report.department}</div>
                    </div>
                    
                    <div className="w-[15%] px-6 py-4">
                      <div className="text-sm text-brand-secondary dark:text-slate-400">{report.defectType}</div>
                    </div>
                    
                    <div className="w-[15%] px-6 py-4 flex flex-col gap-1 items-start">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${report.status === 'approved' ? 'bg-green-100 text-green-800' :
                          report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {report.status === 'approved' && <CheckCircle size={12} className="mr-1" />}
                          {report.status === 'pending' && <Clock size={12} className="mr-1" />}
                          {report.status === 'rejected' && <XCircle size={12} className="mr-1" />}
                          {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : ''}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Stage: {report.kanbanStage || 'Pending'}
                        </div>
                    </div>
                    
                    <div className="w-[15%] px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="p-2 text-brand-primary hover:bg-brand-btn/10 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => alert(`Editing ${report.id}`)}
                          className="p-2 text-brand-primary hover:bg-brand-btn/10 rounded-lg transition-colors duration-200"
                          title="Edit"
                          disabled={report.status !== 'pending'}
                        >
                          <Edit size={18} className={report.status !== 'pending' ? 'opacity-50' : ''} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-brand-primary hover:bg-brand-btn/10 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full px-6 py-12 flex justify-center border-b border-gray-100 dark:border-slate-800">
                  <div className="flex flex-col items-center space-y-3">
                    <FileText size={48} className="text-gray-300" />
                    <p className="text-brand-secondary">No reports found matching your search criteria.</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters or search term.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {paginatedReports.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {paginatedReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-brand-primary bg-brand-btn/10 px-2 py-0.5 rounded">{report.id}</span>
                      <h4 className="font-semibold text-brand-primary mt-1">{report.item}</h4>
                    </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === 'approved' ? 'bg-green-100 text-green-800' :
                            report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {report.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {report.kanbanStage || 'Pending'}
                        </span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-brand-secondary mb-3">
                    <div>
                      <span className="text-gray-400 text-xs block">Vendor</span>
                      {report.vendor}
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Date</span>
                      {report.date}
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Type</span>
                      {report.defectType}
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Qty</span>
                      {report.qty}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColors[report.priority]}`}>
                      {report.priority} priority
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="p-2 text-brand-primary bg-brand-btn/10 rounded-lg"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => alert(`Editing ${report.id}`)}
                        // Note: Reusing the same logic for disabled state
                        disabled={report.status !== 'pending'}
                        className={`p-2 rounded-lg ${report.status !== 'pending' ? 'text-gray-300' : 'text-brand-primary bg-brand-btn/10'}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 text-brand-primary bg-brand-btn/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-brand-secondary">
              No reports found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {paginatedReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-brand-primary">
              Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredReports.length)}</span> of <span className="font-semibold">{filteredReports.length}</span> reports
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft size={16} />
                <span className="ml-1">Previous</span>
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                      ? 'bg-brand-btn text-white'
                      : 'border border-gray-300 text-brand-primary hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span className="mr-1">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" data-modal="true">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up border border-gray-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Report {selectedReport.id}</h2>
                <p className="text-xs text-slate-500">{selectedReport.item} • {selectedReport.department}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => printReport(selectedReport)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Print"><Printer size={18} className="text-slate-500" /></button>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"><XCircle size={20} className="text-slate-400" /></button>
              </div>
            </div>

            <div className="flex-1 min-h-[400px] overflow-y-auto flex flex-col md:flex-row">
              {/* Left: Details + Timeline */}
              <div className="p-5 md:w-1/2 space-y-5 border-r border-gray-100 dark:border-slate-800 overflow-y-auto h-full">
                
                {/* Admin Feedback Alerts */}
                {(selectedReport.rejectionReason || selectedReport.adminRemarks) && (
                  <div className="space-y-3">
                    {selectedReport.status === 'rejected' && selectedReport.rejectionReason && (
                      <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                        <div className="flex items-start">
                          <XCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="text-red-800 dark:text-red-400 font-bold text-xs uppercase">Rejection Reason</h4>
                            <p className="text-red-700 dark:text-red-300 mt-1 text-sm font-medium">{selectedReport.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedReport.status === 'approved' && selectedReport.adminRemarks && (
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                        <div className="flex items-start">
                          <CheckCircle className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase">Approval Remarks</h4>
                            <p className="text-emerald-700 dark:text-emerald-300 mt-1 text-sm font-medium">{selectedReport.adminRemarks}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedReport.status !== 'rejected' && selectedReport.status !== 'approved' && selectedReport.adminRemarks && (
                      <div className="bg-brand-primary/5 border-l-4 border-brand-primary p-4 rounded-r-xl">
                        <div className="flex items-start">
                          <AlertCircle className="text-brand-primary mr-3 mt-0.5 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="text-brand-primary font-bold text-xs uppercase">Admin Remarks</h4>
                            <p className="text-slate-700 dark:text-slate-300 mt-1 text-sm font-medium">{selectedReport.adminRemarks}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Description</p><p className="text-sm text-slate-800 dark:text-slate-200 mt-1">{selectedReport.description}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Vendor</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.vendor}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Defect</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.defectType}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Priority</p><p className={`text-sm font-semibold capitalize ${selectedReport.priority === 'critical' ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>{selectedReport.priority}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Quantity</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.qty}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Stage</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedReport.kanbanStage || 'Pending'}</p></div>
                  </div>
                </div>

                {/* User Image Gallery */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">My Attachments</p>
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
                    <p className="text-xs font-bold text-brand-primary uppercase mb-2">Admin Fix/Verification Images</p>
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
                    <div className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-brand-btn border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Report Created</p><p className="text-xs text-slate-400">{selectedReport.submittedDate}</p></div>
                    {selectedReport.reviewedBy && <div className="relative"><div className={`absolute -left-[22px] top-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${selectedReport.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'}`}></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status: {selectedReport.status}</p><p className="text-xs text-slate-400">{selectedReport.reviewDate} by {selectedReport.reviewedBy}</p></div>}
                    {selectedReport.capaAction && <div className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">CAPA Assigned</p><p className="text-xs text-slate-400">{selectedReport.capaAction}</p></div>}
                    {selectedReport.adminRemarks && <div className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-brand-primary border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Admin Remarks</p><p className="text-xs font-medium text-slate-800 dark:text-white bg-brand-primary/10 p-2 rounded-lg mt-1">{selectedReport.adminRemarks}</p></div>}
                    {selectedReport.rejectionReason && <div className="relative"><div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></div><p className="text-xs font-semibold text-red-500">Rejection Reason</p><p className="text-xs font-medium text-red-700 bg-red-500/10 p-2 rounded-lg mt-1">{selectedReport.rejectionReason}</p></div>}
                  </div>
                </div>
              </div>

              {/* Right: Chat */}
              <div className="p-5 md:w-1/2 bg-gray-50 dark:bg-slate-950 flex flex-col h-full">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center text-sm"><MessageSquare size={16} className="mr-2 text-brand-primary" />Discussion with Admin</h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[350px]">
                  {(!selectedReport.comments || selectedReport.comments.length === 0) ? (
                    <p className="text-sm text-slate-400 italic text-center mt-12">No messages yet. Send a message to the admin below.</p>
                  ) : (
                    selectedReport.comments.map((c, i) => (
                      <div key={i} className={`flex flex-col ${c.role === 'Admin' ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${c.role !== 'Admin' ? 'bg-gradient-to-r from-brand-btn to-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                          <p className="text-xs font-bold mb-1 opacity-70">{c.user} {c.role === 'Admin' && '(Admin)'}</p>
                          <p>{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
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

export default MyReports;
