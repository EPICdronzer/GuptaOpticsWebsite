'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '../../config';
import { adminSetup } from '../../adminSetup';

const AdminLoginPage = () => {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // If already authenticated, skip login and redirect to home
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      router.push('/admin/home');
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput === adminSetup.username && passwordInput === adminSetup.password) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      setIsSuccess(true);
      setLoginError('');
      setTimeout(() => {
        router.push('/admin/home');
      }, 1500);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Design Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 sm:p-12 md:p-14 rounded-3xl border border-white/10 relative z-10 shadow-2xl transition-all duration-500">
        <div className="text-center mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400 mb-3">SYSTEM PORTAL</h2>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none">{siteConfig.name}</h1>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/50 mt-3">Welcome back, {adminSetup.name}</p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-pulse">
            <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-widest text-yellow-400">ACCESS GRANTED</h3>
            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-60 mt-2">Redirecting to Homepage...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-wider opacity-60 pl-1">Username</label>
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="ENTER USERNAME" 
                required 
                className="bg-black border border-white/10 py-3.5 px-4 text-xs sm:text-sm font-semibold  tracking-wider rounded-xl focus:border-yellow-400 outline-none text-white transition-colors w-full" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-wider opacity-60 pl-1">Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="ENTER PASSWORD" 
                required 
                className="bg-black border border-white/10 py-3.5 px-4 text-xs sm:text-sm font-semibold  tracking-wider rounded-xl focus:border-yellow-400 outline-none text-white transition-colors w-full" 
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-xs font-black uppercase tracking-widest text-center mt-2 border border-red-500/20 bg-red-500/5 p-3 rounded-lg animate-shake">
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="bg-yellow-400 text-black py-3.5 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-[0.2em] mt-4 hover:bg-yellow-300 active:scale-[0.98] transition-all shadow-lg shadow-yellow-400/10 cursor-pointer w-full"
            >
              AUTHORIZE & ENTER
            </button>
          </form>
        )}

        <div className="text-center mt-8 pt-8 border-t border-white/5">
          <a href="/" className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
            ← Return to Main Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
