'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '../config';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (pathname === '/admin/login') {
        router.push('/admin/home');
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
    setCheckingAuth(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // If currently checking auth, display a loading state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-yellow-400 mb-4"></div>
        <p className="text-xs uppercase tracking-[0.2em] opacity-60">Verifying System Access...</p>
      </div>
    );
  }

  // If on login page, display without layout wrap
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, display guard screen while router redirects
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center font-sans">
        <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-500 mb-2">ACCESS RESTRICTED</h2>
        <p className="text-xs uppercase tracking-widest opacity-60">Redirecting to System Authorization...</p>
      </div>
    );
  }

  const tabs = [
    { name: 'home', label: 'Overview', path: '/admin/home' },
    { name: 'products', label: 'Products', path: '/admin/products' },
    { name: 'appointments', label: 'Appointments', path: '/admin/appointments' },
    { name: 'orders', label: 'Orders', path: '/admin/orders' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/3 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-12 border-b border-white/10 pb-8 relative">
          <div className="flex justify-between items-center w-full md:w-auto">
            <div>
              <Link href="/admin/home">
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter cursor-pointer hover:text-yellow-400 transition-colors">
                  Admin Portal
                </h1>
              </Link>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-white/40 mt-1">
                Management Dashboard • {siteConfig.name}
              </p>
            </div>
            
            {/* Mobile Hamburger Toggle */}
            <button 
              className="md:hidden text-white hover:text-yellow-400 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row items-center gap-8">
            <nav className="flex gap-8">
              {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                  <Link
                    key={tab.name}
                    href={tab.path}
                    className={`text-xs font-black uppercase tracking-[0.2em] transition-all pb-2 ${
                      isActive ? 'text-yellow-400 border-b-2 border-yellow-400' : 'opacity-40 hover:opacity-100 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <button 
              onClick={handleLogout}
              className="text-xs font-black uppercase tracking-[0.2em] px-4 py-2 border border-red-500/30 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-center cursor-pointer active:scale-[0.97]"
            >
              Logout
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-4 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 absolute top-full left-0 z-50 mt-2 shadow-2xl">
              <nav className="flex flex-col gap-4">
                {tabs.map((tab) => {
                  const isActive = pathname === tab.path;
                  return (
                    <Link
                      key={tab.name}
                      href={tab.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-black uppercase tracking-[0.2em] transition-all p-3 rounded-xl border ${
                        isActive ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'opacity-60 border-transparent hover:bg-white/5 hover:opacity-100'
                      }`}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="w-full h-px bg-white/10 my-2"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-sm font-black uppercase tracking-[0.2em] px-4 py-4 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-center cursor-pointer active:scale-[0.97]"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main className="animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
