import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Fingerprint, Lock, ArrowRight } from 'lucide-react';

const AdminLoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ employeeId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { default: api } = await import('./api.js');
      const response = await api.post('/auth/login', {
        employeeId: credentials.employeeId,
        password: credentials.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      onLogin(response.data);
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Authentication Failed. Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 font-sans selection:bg-brand-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[120px] mix-blend-screen"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-300 text-xs font-medium tracking-widest uppercase shadow-2xl backdrop-blur-md">
            <Shield size={14} className="text-brand-primary" />
            <span>Admin Control Center</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
          {/* Logo / Header area */}
          <div className="px-8 pt-10 pb-6 border-b border-slate-800/50 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent"></div>

            <div className="w-20 h-20 mx-auto bg-slate-950 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-800 relative group">
              <div className="absolute inset-0 bg-brand-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              <img src="/sonacomsterlogo.png" alt="Sona Comstar" className="w-12 h-12 object-contain relative z-10" />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">System Authorization</h1>
            <p className="text-slate-400 text-sm">Verify your identity to proceed</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Admin Username</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl bg-slate-950/50 border ${activeInput === 'id' ? 'border-brand-primary ring-1 ring-brand-primary/50' : 'border-slate-800 hover:border-slate-700'}`}>
                  <div className="pl-4 pr-3 text-slate-500">
                    <Fingerprint size={18} className={activeInput === 'id' ? 'text-brand-primary' : ''} />
                  </div>
                  <input
                    type="text"
                    required
                    value={credentials.employeeId}
                    onChange={(e) => setCredentials({ ...credentials, employeeId: e.target.value })}
                    onFocus={() => setActiveInput('id')}
                    onBlur={() => setActiveInput(null)}
                    className="w-full py-3.5 pr-4 bg-transparent text-white placeholder:text-slate-600 outline-none font-mono text-sm"
                    placeholder="admin"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Passcode</label>
                <div className={`relative flex items-center transition-all duration-300 rounded-xl bg-slate-950/50 border ${activeInput === 'password' ? 'border-brand-primary ring-1 ring-brand-primary/50' : 'border-slate-800 hover:border-slate-700'}`}>
                  <div className="pl-4 pr-3 text-slate-500">
                    <Lock size={18} className={activeInput === 'password' ? 'text-brand-primary' : ''} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    onFocus={() => setActiveInput('password')}
                    onBlur={() => setActiveInput(null)}
                    className="w-full py-3.5 pr-12 bg-transparent text-white placeholder:text-slate-600 outline-none font-mono text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center space-x-2 bg-brand-primary hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <Key size={18} className="group-hover:-rotate-12 transition-transform" />
                  <span>Authenticate</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all absolute right-8" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-[10px] text-slate-500 font-mono">
              UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED. <br />
              ALL ACTIVITY IS MONITORED AND LOGGED.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
