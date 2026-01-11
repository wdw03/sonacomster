import React, { useState } from 'react';
import { Calendar, Building, Package, Camera, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';

const NewReport = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    department: '',
    vendor: '',
    itemCode: '',
    quantity: '',
    defectType: '',
    description: '',
    priority: 'medium',
    images: []
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ['Production', 'Quality Assurance', 'Maintenance', 'Warehouse', 'Logistics'];
  const defectTypes = ['Hardness Issue', 'Dimension Error', 'Surface Crack', 'Material Mix-up', 'Finish Problem', 'Assembly Issue'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages([...uploadedImages, ...imagePreviews]);
  };

  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Report submitted successfully!');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        department: '',
        vendor: '',
        itemCode: '',
        quantity: '',
        defectType: '',
        description: '',
        priority: 'medium',
        images: []
      });
      setUploadedImages([]);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('draft_report', JSON.stringify({ ...formData, uploadedImages }));
    alert('Report saved as draft successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Quality Report</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to submit a quality issue for investigation</p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <AlertCircle size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quality Problem Report</h3>
              <p className="text-sm text-gray-600">All fields marked with * are required. Please provide accurate details.</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span>Basic Information</span>
                </h4>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Report Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vendor Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Building size={18} className="text-blue-600" />
                  <span>Vendor Details</span>
                </h4>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vendor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    placeholder="Enter vendor name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleInputChange}
                    placeholder="Enter item code"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Defect Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Package size={18} className="text-blue-600" />
                  <span>Defect Details</span>
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Defect Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="defectType"
                    value={formData.defectType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    required
                  >
                    <option value="">Select Defect Type</option>
                    {defectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the defect in detail, including when it was discovered, potential causes, and any immediate actions taken..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Minimum 50 characters. Be as detailed as possible.</p>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Upload Evidence Images
              <span className="text-gray-500 font-normal ml-2">(Optional but recommended)</span>
            </label>

            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-300 bg-gray-50 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="inline-flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Camera size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Drag & drop images here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                  </div>
                  <p className="text-xs text-gray-400">Supports JPG, PNG up to 5MB each</p>
                </div>
              </label>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                  Uploaded Images ({uploadedImages.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>All information is encrypted and secure</span>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Save as Draft</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Note:</span> After submission, your report will be reviewed by the quality team.
                You will receive a notification once the review is complete.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReport;