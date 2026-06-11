import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const UserLoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ employeeId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 15,
          y: (e.clientY / window.innerHeight) * 15,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { default: api } = await import('./api.js');
      const response = await api.post('/auth/login', {
        employeeId: credentials.employeeId,
        password: credentials.password
      });
      if (response.data.token) localStorage.setItem('token', response.data.token);
      onLogin(response.data);
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 font-sans">
      {/* Warm Abstract Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] rounded-full bg-rose-300/20 blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-orange-300/20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[15%] w-[35%] h-[35%] rounded-full bg-pink-200/20 blur-[80px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4364c08_1px,transparent_1px),linear-gradient(to_bottom,#f4364c08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div
        className="relative z-10 w-full max-w-[440px] px-6"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      >
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_40px_rgb(244,63,94,0.08)] p-8 md:p-12 overflow-hidden relative">
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-60"></div>

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-xl shadow-rose-100 transform transition-transform hover:scale-105 hover:-rotate-2 border border-rose-100 p-4">
              <img src="/sonacomsterlogo.png" alt="Sona Comstar" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-rose-400 text-sm font-medium">Sign in to your Quality Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-bold uppercase tracking-widest ml-1 transition-colors ${activeInput === 'id' ? 'text-rose-500' : 'text-slate-400'}`}>
                Username
              </label>
              <div className={`relative flex items-center rounded-2xl bg-white/80 border transition-all duration-300 overflow-hidden ${activeInput === 'id' ? 'border-rose-400 shadow-[0_0_0_3px_rgba(244,63,94,0.1)]' : 'border-rose-100 hover:border-rose-200'}`}>
                <div className="pl-4 pr-3 text-rose-300">
                  <User size={18} className={activeInput === 'id' ? 'text-rose-500' : ''} />
                </div>
                <input
                  type="text"
                  required
                  value={credentials.employeeId}
                  onFocus={() => setActiveInput('id')}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setCredentials({ ...credentials, employeeId: e.target.value })}
                  className="w-full py-3.5 pr-4 bg-transparent text-slate-800 placeholder:text-rose-300 outline-none font-semibold text-sm"
                  placeholder="user"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${activeInput === 'pass' ? 'text-rose-500' : 'text-slate-400'}`}>
                  Password
                </label>
                <a href="#" className="text-[11px] text-rose-400 hover:text-rose-600 font-bold transition-colors">Forgot?</a>
              </div>
              <div className={`relative flex items-center rounded-2xl bg-white/80 border transition-all duration-300 overflow-hidden ${activeInput === 'pass' ? 'border-rose-400 shadow-[0_0_0_3px_rgba(244,63,94,0.1)]' : 'border-rose-100 hover:border-rose-200'}`}>
                <div className="pl-4 pr-3 text-rose-300">
                  <Lock size={18} className={activeInput === 'pass' ? 'text-rose-500' : ''} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onFocus={() => setActiveInput('pass')}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full py-3.5 pr-12 bg-transparent text-slate-800 placeholder:text-rose-300 outline-none font-semibold tracking-widest"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-rose-300 hover:text-rose-500 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-rose-100 flex items-center justify-center space-x-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
