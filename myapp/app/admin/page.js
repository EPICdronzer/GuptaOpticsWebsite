'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminRootPage = () => {
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      router.push('/admin/home');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center font-sans">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-yellow-400 mb-4"></div>
      <p className="text-xs uppercase tracking-[0.2em] opacity-60">Initializing Portal...</p>
    </div>
  );
};

export default AdminRootPage;
