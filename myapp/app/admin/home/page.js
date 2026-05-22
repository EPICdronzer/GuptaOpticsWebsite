'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getAppointments, getOrders } from '../../../actions/adminActions';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    appointmentsPending: 0,
    appointmentsTotal: 0,
    ordersActive: 0,
    ordersTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, appointments, orders] = await Promise.all([
          getProducts(),
          getAppointments(),
          getOrders(),
        ]);

        setStats({
          productsCount: products.length,
          appointmentsPending: appointments.filter(a => a.status === 'pending').length,
          appointmentsTotal: appointments.length,
          ordersActive: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
          ordersTotal: orders.length,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome & System Banner */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">SYSTEM READY</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-4">Welcome back, Administrator</h2>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/50 mt-2 max-w-xl">
            You are currently authorized to view system metrics and manage product inventories, book client visits, and process sales orders.
          </p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Products Summary Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-yellow-400/30 transition-all duration-300">
          <div>
            <div className="w-12 h-12 bg-yellow-400/10 text-yellow-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">Products</h3>
            <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Catalog Inventory Management</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{stats.productsCount}</span>
              <span className="text-xs font-black uppercase text-yellow-400">Items Listed</span>
            </div>
          </div>
          <Link href="/admin/products" className="mt-8 inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
            Manage Catalog 
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Appointments Summary Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-yellow-400/30 transition-all duration-300">
          <div>
            <div className="w-12 h-12 bg-yellow-400/10 text-yellow-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">Appointments</h3>
            <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Client Eyecare Bookings</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{stats.appointmentsPending}</span>
                <span className="text-xs font-black uppercase text-yellow-400">Pending Confirmation</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">({stats.appointmentsTotal} total bookings scheduled)</span>
            </div>
          </div>
          <Link href="/admin/appointments" className="mt-8 inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
            Manage Bookings
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Orders Summary Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-yellow-400/30 transition-all duration-300">
          <div>
            <div className="w-12 h-12 bg-yellow-400/10 text-yellow-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">Orders</h3>
            <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Sales Fulfillment Status</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{stats.ordersActive}</span>
                <span className="text-xs font-black uppercase text-yellow-400">Awaiting Processing</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">({stats.ordersTotal} total orders received)</span>
            </div>
          </div>
          <Link href="/admin/orders" className="mt-8 inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
            Fulfill Orders
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardHome;
