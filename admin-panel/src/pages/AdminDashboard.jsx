import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle, XCircle, AlertCircle, MessageSquare, Brain, ArrowRight } from 'lucide-react';
import api from '../api';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table' or 'kanban'
  const [selectedReport, setSelectedReport] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [capaAction, setCapaAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const stages = ['Pending', 'Under Investigation', 'CAPA Assigned', 'Resolved'];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await api.put(`/reports/${selectedReport.id}/status`, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        capaAction: capaAction || undefined
      });
      alert(`Report marked as ${status}`);
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/reports/${selectedReport.id}/comment`, { text: newComment });
      setNewComment('');
      // Refresh selected report
      const res = await api.get('/reports');
      setReports(res.data);
      const updated = res.data.find(r => r.id === selectedReport.id);
      if (updated) setSelectedReport(updated);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleStageChange = async (reportId, newStage) => {
    try {
      await api.put(`/reports/${reportId}/stage`, { kanbanStage: newStage });
      fetchReports();
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const exportData = () => {
    const csvRows = [];
    const headers = ['ID', 'Item', 'Vendor', 'Priority', 'Status', 'Stage', 'Submitter'];
    csvRows.push(headers.join(','));
    reports.forEach(r => {
      csvRows.push(`${r.id},${r.item},${r.vendor},${r.priority},${r.status},${r.kanbanStage || 'Pending'},${r.submittedBy}`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Admin_Reports_Export.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Ultimate Admin Control Center</h1>
          <p className="text-brand-secondary">Manage workflows, analyze AI insights, and control reports.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setView(view === 'table' ? 'kanban' : 'table')}
            className="px-4 py-2 border-2 border-brand-btn text-brand-primary rounded-xl font-semibold hover:bg-brand-btn/10 transition-colors"
          >
            Switch to {view === 'table' ? 'Kanban View' : 'Table View'}
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-brand-btn text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Download size={18} />
            <span>Export Master Data</span>
          </button>
        </div>
      </div>

      {/* AI Insights Widget */}
      <div className="bg-gradient-to-r from-brand-btn/10 to-brand-primary/5 rounded-2xl p-6 border border-brand-btn/20 shadow-sm flex items-start space-x-4">
        <div className="p-3 bg-white rounded-full shadow-sm">
          <Brain className="text-brand-primary w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-primary">AI Smart Insight</h3>
          <p className="text-brand-secondary mt-1">
            Based on historical data, <span className="font-semibold">Tata Steel</span> has a 34% probability of Dimension Errors this week. It's recommended to proactively assign a CAPA for their next batch.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-btn"></div>
        </div>
      ) : view === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm text-brand-primary">
                <tr>
                  <th className="p-4 font-semibold">Report ID</th>
                  <th className="p-4 font-semibold">Submitter</th>
                  <th className="p-4 font-semibold">Vendor</th>
                  <th className="p-4 font-semibold">Defect</th>
                  <th className="p-4 font-semibold">Stage</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-brand-btn/5 transition-colors group">
                    <td className="p-4 font-medium text-slate-900">{report.id}</td>
                    <td className="p-4 text-brand-secondary">
                      <div>{report.submittedBy}</div>
                      <div className="text-xs opacity-70">{report.submitterEmail || 'N/A'}</div>
                    </td>
                    <td className="p-4 font-medium">{report.vendor}</td>
                    <td className="p-4 text-brand-secondary">{report.defectType}</td>
                    <td className="p-4">
                      <select
                        value={report.kanbanStage || 'Pending'}
                        onChange={(e) => handleStageChange(report.id, e.target.value)}
                        className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none text-brand-primary"
                      >
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'approved' ? 'bg-brand-primary/10 text-brand-primary' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-brand-btn/10 text-brand-primary'
                        }`}>
                        {report.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1.5 text-xs font-semibold bg-brand-btn/10 text-brand-primary rounded-lg hover:bg-brand-btn hover:text-white transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage} className="w-80 flex-shrink-0 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-2xl">
                <h3 className="font-bold text-brand-primary">{stage}</h3>
                <p className="text-xs text-brand-secondary">{reports.filter(r => (r.kanbanStage || 'Pending') === stage).length} Reports</p>
              </div>
              <div className="p-4 flex-1 space-y-3 min-h-[400px]">
                {reports.filter(r => (r.kanbanStage || 'Pending') === stage).map(report => (
                  <div
                    key={report.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-brand-btn/50 transition-colors"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-slate-800">{report.id}</span>
                      <span className={`w-2 h-2 rounded-full ${report.priority === 'critical' ? 'bg-red-500' : 'bg-brand-btn'}`}></span>
                    </div>
                    <p className="text-sm font-medium text-brand-primary mb-1">{report.vendor}</p>
                    <p className="text-xs text-brand-secondary line-clamp-2">{report.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{report.submittedBy}</span>
                      <div className="flex items-center">
                        <MessageSquare size={12} className="mr-1" />
                        <span>{report.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-brand-primary">Review Report {selectedReport.id}</h2>
                <p className="text-sm text-brand-secondary">Submitted by {selectedReport.submittedBy}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-200 rounded-full text-slate-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              {/* Details Side */}
              <div className="p-6 md:w-1/2 space-y-6 border-r border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-brand-secondary">Description</p>
                  <p className="text-slate-800 mt-1">{selectedReport.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-brand-secondary uppercase">Vendor</p>
                    <p className="font-medium text-brand-primary">{selectedReport.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-secondary uppercase">Defect Type</p>
                    <p className="font-medium text-brand-primary">{selectedReport.defectType}</p>
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedReport.status === 'pending' && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-brand-primary">Admin Actions</h4>
                    <div>
                      <label className="block text-xs font-semibold text-brand-secondary mb-1">Assign CAPA (Corrective Action)</label>
                      <input
                        type="text"
                        value={capaAction}
                        onChange={(e) => setCapaAction(e.target.value)}
                        placeholder="E.g., Issue warning to vendor..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-brand-btn"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-secondary mb-1">Rejection Reason (if rejecting)</label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-brand-btn"
                      />
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => handleUpdateStatus('approved')}
                        className="flex-1 py-2 bg-brand-primary/10 text-brand-primary font-bold rounded-lg hover:bg-brand-primary/20 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={18} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('rejected')}
                        className="flex-1 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                      >
                        <AlertCircle size={18} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat / Comments Side */}
              <div className="p-6 md:w-1/2 bg-gray-50 flex flex-col">
                <h3 className="font-bold text-brand-primary mb-4 flex items-center"><MessageSquare size={18} className="mr-2" /> Collaboration Log</h3>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {(!selectedReport.comments || selectedReport.comments.length === 0) ? (
                    <p className="text-sm text-slate-400 italic text-center mt-10">No discussion yet.</p>
                  ) : (
                    selectedReport.comments.map((comment, idx) => (
                      <div key={idx} className={`flex flex-col ${comment.role === 'Admin' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl ${comment.role === 'Admin' ? 'bg-brand-btn text-white rounded-tr-none' : 'bg-white border border-gray-200 text-slate-800 rounded-tl-none'}`}>
                          <p className="text-xs font-bold mb-1 opacity-80">{comment.user} ({comment.role})</p>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 rounded-xl border border-gray-300 outline-none focus:border-brand-btn text-sm shadow-sm"
                  />
                  <button
                    onClick={handleAddComment}
                    className="p-3 bg-brand-btn text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
