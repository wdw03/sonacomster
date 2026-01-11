import React, { useState, useEffect, useRef } from 'react'
import { Settings, User, Bell, Lock, Moon, Globe, Camera, X, Save, CheckCircle2, ZoomIn, ZoomOut, Image as ImageIcon, Move } from 'lucide-react'

const SettingsPage = ({ darkMode, toggleDarkMode, user, updateUser }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en'
  })

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUser, setTempUser] = useState(user || {});
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [baseScale, setBaseScale] = useState(1); // Scale to fit resize area
  const [zoomLevel, setZoomLevel] = useState(1); // User zoom slider (1x - 5x)
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Sync tempUser when user prop updates
  useEffect(() => {
    if (user) setTempUser(user);
  }, [user]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calculate base scale to fit the image into a 320px box (approx editor size)
          // We want the SHORTER side to match 300px (Cover behavior) so no whitespace
          // But user complained about zoom, so maybe match LONGER side (Contain) initially?
          // Let's go with a safe "Fit" approach: Make the image visible.
          // editor box is w-full h-80 (approx 500px width, 320px height).
          // Let's safely target 300px scale.
          const targetSize = 300;
          const scaleW = targetSize / img.naturalWidth;
          const scaleH = targetSize / img.naturalHeight;
          // Choose the larger scale to ensure "Cover" (starts completely filling circle)
          // OR choose smaller to "Contain" (see whole image).
          // User said "apne size me rahe" (stay in its size) -> visual fit.
          // Let's use logic: render at essentially 'contain' style relative to 350px

          // We'll effectively normalize so zoomLevel 1 = optimum fit
          const calculatedScale = Math.max(scaleW, scaleH);

          setRawImage(event.target.result);
          setBaseScale(calculatedScale);
          setZoomLevel(1);
          setCropPosition({ x: 0, y: 0 });
          setShowCropper(true);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas Image Processing (The Magic!)
  const handleCropSave = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    // Set fixed output size (e.g., 300x300 for profile pic)
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw circular mask
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Calculate draw dimensions based on scale and position
    // Total Scale = baseScale * zoomLevel
    const totalScale = baseScale * zoomLevel;

    // We need to map the CSS translate (screen pixels) to Canvas pixels?
    // Actually, our stored cropPosition is in screen pixels (visual adjustment).
    // The image is drawn at native size * totalScale.
    // So if I dragged 50px right on screen...
    // The backing image is NATIVE size.

    // Logic:
    // Screen Center = Canvas Center (size/2, size/2)
    // Draw Image at (size/2 + x, size/2 + y) with scale

    ctx.translate(size / 2, size / 2);
    ctx.translate(cropPosition.x, cropPosition.y);
    ctx.scale(totalScale, totalScale);

    // Draw centered
    ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

    // Get optimized Base64
    const optimizedImage = canvas.toDataURL('image/jpeg', 0.85); // 85% Quality JPEG

    setTempUser({ ...tempUser, profileImage: optimizedImage });
    setShowCropper(false);
    setRawImage(null);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setCropPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateUser(tempUser);
      setIsSaving(false);
      setIsEditingProfile(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-slide-right pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
        </div>
        <div className="p-3 bg-blue-100 dark:bg-slate-800 rounded-2xl">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Settings Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover-card relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="relative pt-12 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-xl mx-auto">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                      {user?.avatar || "US"}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-gray-100 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                  title="Edit Profile"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "User Name"}</h2>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{user?.role || "Role"}</p>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{user?.department || "Department"}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                <div className="flex justify-between text-sm">
                  <div className="text-center flex-1 border-r border-gray-100 dark:border-slate-700">
                    <p className="font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-xs text-gray-500">Reports</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">98%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-2.5 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover-card">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-400" />
              General Preferences
            </h3>

            <div className="space-y-6">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Receive alerts via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl">
                    <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Reduce eye strain</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Language</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">System language</p>
                  </div>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full md:w-auto px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover-card">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Security</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Currently Disabled</p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 text-gray-700 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Password</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Last changed 3 months ago</p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 text-gray-700 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${showCropper ? 'max-w-2xl' : 'max-w-lg'} overflow-hidden animate-scale-up border border-gray-200 dark:border-slate-600 transition-all duration-300`}>

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {showCropper ? 'Adjust Profile Picture' : 'Edit Profile'}
              </h3>
              <button
                onClick={() => {
                  setIsEditingProfile(false);
                  setShowCropper(false);
                  setRawImage(null);
                }}
                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            {showCropper ? (
              // CROPPER UI
              <div className="p-6 flex flex-col items-center animate-fade-in">
                <div
                  className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden cursor-move touch-none flex items-center justify-center border border-slate-700 shadow-inner group"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Grid / Guide Lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 z-10"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                      backgroundSize: '40px 40px'
                    }}>
                  </div>

                  {/* Circular Mask Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none bg-black/50 mask-circle"></div>
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="w-[300px] h-[300px] rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"></div>
                  </div>

                  {/* The Image */}
                  <img
                    ref={imageRef}
                    src={rawImage}
                    alt="Crop Preview"
                    className="max-w-none origin-center pointer-events-none select-none"
                    draggable={false}
                    style={{
                      transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${baseScale * zoomLevel})`
                    }}
                  />

                  {/* Drag Hint */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <Move size={12} className="mr-1" /> Drag to move
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <ZoomOut size={20} className="text-gray-500" />
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={zoomLevel}
                      onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <ZoomIn size={20} className="text-gray-500" />
                  </div>

                  <div className="flex justify-between space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setShowCropper(false);
                        setRawImage(null);
                      }}
                      className="flex-1 py-2.5 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCropSave}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center"
                    >
                      <CheckCircle2 size={18} className="mr-2" /> Apply & Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // NORMAL FORM
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5 animate-fade-in">
                {/* Avatar Preview */}
                <div className="flex justify-center mb-6">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {tempUser.profileImage ? (
                      <img
                        src={tempUser.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {tempUser.avatar || "US"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white mb-1" size={24} />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={tempUser.name || ''}
                        onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Avatar Initials</label>
                    <input
                      type="text"
                      maxLength="2"
                      value={tempUser.avatar || ''}
                      onChange={(e) => setTempUser({ ...tempUser, avatar: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all uppercase text-center tracking-widest font-bold"
                      placeholder="AB"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Employee ID</label>
                    <input
                      type="text"
                      value={tempUser.employeeId || ''}
                      readOnly
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 dark:text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Job Role</label>
                    <input
                      type="text"
                      value={tempUser.role || ''}
                      onChange={(e) => setTempUser({ ...tempUser, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. Quality Manager"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Department</label>
                    <input
                      type="text"
                      value={tempUser.department || ''}
                      onChange={(e) => setTempUser({ ...tempUser, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. Quality Assurance"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2.5 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  )
}

export default SettingsPage
