import React, { useState, useEffect } from 'react';
import { Layout, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ employeeId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  // Background Animation Effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Gentle parallax effect only on desktop
      if (window.innerWidth > 768) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 20,
          y: (e.clientY / window.innerHeight) * 20,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onLogin({
        employeeId: credentials.employeeId || 'EMP001',
        name: "Amit Sharma",
        role: "Quality Manager",
        department: "Quality Assurance",
        avatar: "AS",
        email: "amit.sharma@sonacomstar.com"
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
      {/* 1. Dynamic Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-blob mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen"></div>
          <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
        </div>
      </div>

      {/* 2. Glass Card Container */}
      <div
        className="relative z-10 w-full max-w-[440px] px-4"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      >
        <div className="group relative bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 md:p-12 overflow-hidden transition-all duration-500 hover:shadow-cyan-500/10 hover:border-white/20">

          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none"></div>

          {/* Header */}
          <div className="relative z-10 text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-lg shadow-blue-500/30 transform transition-transform group-hover:scale-105 group-hover:rotate-3 overflow-hidden p-2">
              <img src="/sonacomsterlogo.png" alt="Sona Comstar" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Log in to SONACOMSTAR Quality Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

            {/* Employee ID Input */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeInput === 'id' ? 'text-cyan-400' : 'text-slate-500'}`}>
                Employee ID
              </label>
              <div className={`relative group/input transition-all duration-300 rounded-2xl bg-slate-800/50 border ${activeInput === 'id' ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-cyan-400 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  onFocus={() => setActiveInput('id')}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setCredentials({ ...credentials, employeeId: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-600 focus:outline-none font-medium"
                  placeholder="e.g. EMP-90210"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeInput === 'pass' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  Password
                </label>
                <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Forgot?</a>
              </div>
              <div className={`relative group/input transition-all duration-300 rounded-2xl bg-slate-800/50 border ${activeInput === 'pass' ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-cyan-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  onFocus={() => setActiveInput('pass')}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-600 focus:outline-none font-medium tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              <div className="relative flex items-center justify-center w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-white font-bold text-lg rounded-2xl transition-all group-hover:bg-opacity-90">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
            <ShieldCheck size={14} className="text-green-400" />
            <span className="text-xs text-slate-400">256-bit Secure Connection</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;