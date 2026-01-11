import React, { useState, useEffect } from 'react';
import {
  Search, Download, Filter, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, ExternalLink, FileText,
  CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react';

const MyReports = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 5;

  // Sample reports data
  const reports = [
    {
      id: "RPT-2024-001",
      item: "Gear Assembly",
      vendor: "ABC Ltd",
      date: "2024-04-26",
      status: "pending",
      qty: 10,
      priority: "high",
      department: "Production",
      defectType: "Dimension Error",
      description: "Gear teeth dimensions not meeting specifications. Deviation of 0.5mm from required measurements.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-26 10:30 AM",
      reviewedBy: null,
      reviewDate: null
    },
    {
      id: "RPT-2024-002",
      item: "Bearing Set",
      vendor: "Tata Steel",
      date: "2024-04-25",
      status: "approved",
      qty: 5,
      priority: "medium",
      department: "Quality Assurance",
      defectType: "Hardness Issue",
      description: "Bearing hardness below specification. Required 60 HRC, measured 55 HRC.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-25 02:45 PM",
      reviewedBy: "Quality Manager",
      reviewDate: "2024-04-25 04:30 PM"
    },
    {
      id: "RPT-2024-003",
      item: "Oil Seal",
      vendor: "SKF India",
      date: "2024-04-24",
      status: "rejected",
      qty: 100,
      priority: "low",
      department: "Maintenance",
      defectType: "Surface Crack",
      description: "Multiple surface cracks observed on oil seal surface. Batch needs replacement.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-24 09:15 AM",
      reviewedBy: "Quality Manager",
      reviewDate: "2024-04-24 11:20 AM",
      rejectionReason: "Cracks are within acceptable limits as per revised guidelines."
    },
    {
      id: "RPT-2024-004",
      item: "Valve Body",
      vendor: "Bosch Ltd",
      date: "2024-04-23",
      status: "pending",
      qty: 25,
      priority: "critical",
      department: "Production",
      defectType: "Material Mix-up",
      description: "Incorrect material grade used in valve body manufacturing. Received SS304 instead of SS316.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-23 03:30 PM",
      reviewedBy: null,
      reviewDate: null
    },
    {
      id: "RPT-2024-005",
      item: "Piston Ring",
      vendor: "Mahindra",
      date: "2024-04-22",
      status: "approved",
      qty: 50,
      priority: "medium",
      department: "Warehouse",
      defectType: "Finish Problem",
      description: "Surface finish not meeting specification. Required Ra 0.8, measured Ra 1.2.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-22 11:00 AM",
      reviewedBy: "Quality Manager",
      reviewDate: "2024-04-22 02:15 PM"
    },
    {
      id: "RPT-2024-006",
      item: "Gasket",
      vendor: "ABC Ltd",
      date: "2024-04-21",
      status: "pending",
      qty: 200,
      priority: "low",
      department: "Logistics",
      defectType: "Dimension Error",
      description: "Thickness variation beyond tolerance limit. ±0.5mm variation observed.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-21 01:45 PM",
      reviewedBy: null,
      reviewDate: null
    },
    {
      id: "RPT-2024-007",
      item: "Shaft",
      vendor: "Tata Steel",
      date: "2024-04-20",
      status: "approved",
      qty: 15,
      priority: "high",
      department: "Production",
      defectType: "Hardness Issue",
      description: "Surface hardness below specification affecting wear resistance.",
      submittedBy: "Amit Sharma",
      submittedDate: "2024-04-20 10:00 AM",
      reviewedBy: "Quality Manager",
      reviewDate: "2024-04-20 03:30 PM"
    },
  ];

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.status === filter;
    const matchesSearch = report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.defectType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  const priorityColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-blue-100 text-blue-800',
    low: 'bg-green-100 text-green-800',
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      alert(`Report ${id} deleted successfully!`);
      // In real app, make API call to delete
    }
  };

  const handleExport = () => {
    alert('Exporting reports to Excel...');
    // In real app, implement export functionality
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Quality Reports</h1>
          <p className="text-gray-600 mt-2">Track and manage all your submitted quality reports</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Download size={18} />
            <span>Export Excel</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300">
            <Filter size={18} />
            <span>Advanced Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-600">{stat.label}</p>
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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status === 'all' ? 'All Reports' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Table - Desktop View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Report ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Defect Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-blue-600">{report.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{report.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{report.item}</div>
                      <div className="text-sm text-gray-600">{report.vendor} • Qty: {report.qty}</div>
                      <div className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[report.priority]}`}>
                        {report.priority}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-900">{report.department}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-600">{report.defectType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${report.status === 'approved' ? 'bg-green-100 text-green-800' :
                        report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {report.status === 'approved' && <CheckCircle size={12} className="mr-1" />}
                        {report.status === 'pending' && <Clock size={12} className="mr-1" />}
                        {report.status === 'rejected' && <XCircle size={12} className="mr-1" />}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => alert(`Editing ${report.id}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                          disabled={report.status !== 'pending'}
                        >
                          <Edit size={18} className={report.status !== 'pending' ? 'opacity-50' : ''} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <FileText size={48} className="text-gray-300" />
                      <p className="text-gray-500">No reports found matching your search criteria.</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {paginatedReports.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {paginatedReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{report.id}</span>
                      <h4 className="font-semibold text-gray-900 mt-1">{report.item}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === 'approved' ? 'bg-green-100 text-green-800' :
                        report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
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
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => alert(`Editing ${report.id}`)}
                        // Note: Reusing the same logic for disabled state
                        disabled={report.status !== 'pending'}
                        className={`p-2 rounded-lg ${report.status !== 'pending' ? 'text-gray-300' : 'text-green-600 bg-green-50'}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No reports found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {paginatedReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-700">
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
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Report Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedReport.id}</h4>
                  <p className="text-gray-600">{selectedReport.item}</p>
                </div>
                <div className="flex justify-end">
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${selectedReport.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedReport.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor</label>
                    <p className="text-gray-900">{selectedReport.vendor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                    <p className="text-gray-900">{selectedReport.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                    <p className="text-gray-900">{selectedReport.qty} units</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Defect Type</label>
                    <p className="text-gray-900">{selectedReport.defectType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[selectedReport.priority]}`}>
                      {selectedReport.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Submitted Date</label>
                    <p className="text-gray-900">{selectedReport.submittedDate}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedReport.description}</p>
                </div>
              </div>

              {/* Review Details (if available) */}
              {selectedReport.reviewedBy && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Review Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Reviewed By</label>
                      <p className="text-gray-900">{selectedReport.reviewedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Review Date</label>
                      <p className="text-gray-900">{selectedReport.reviewDate}</p>
                    </div>
                  </div>
                  {selectedReport.rejectionReason && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason</label>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-700">{selectedReport.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
                <ExternalLink size={18} />
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;