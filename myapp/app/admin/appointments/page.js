'use client';
import React, { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from '../../../actions/adminActions';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, aptId: null, aptName: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const showToast = (message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      setAppointments(await getAppointments());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400"></div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter((apt) => 
    apt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="relative w-full sm:max-w-xs">
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH BY NAME..." 
            className="bg-black/50 border border-white/10 p-3 pl-9 text-xs font-semibold uppercase tracking-widest rounded-xl focus:border-yellow-400 outline-none w-full text-white" 
          />
          <svg className="w-4 h-4 text-white/30 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        
        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-white/10">
          {currentAppointments.map((apt) => {
            const aptDate = new Date(apt.date);
            const isOld = apt.status === 'pending' && aptDate.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
            const displayStatus = isOld ? 'Old Request' : apt.status;
            
            return (
              <div key={`mobile-${apt._id}`} className="p-5 flex flex-col gap-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="font-black uppercase text-sm">{apt.name}</div>
                    {apt.phone && (
                      <div className="text-[10px] opacity-60 font-semibold tracking-widest">📞 {apt.phone}</div>
                    )}
                    <div className="text-[10px] font-black uppercase tracking-wider text-yellow-400">
                      {apt.location === 'home' ? '🏠 At Home' : '🏪 At Shop'}
                    </div>
                  </div>
                  <div className="text-xs opacity-60 text-right">{new Date(apt.date).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                    displayStatus === 'completed' 
                      ? 'bg-green-500/20 text-green-500' 
                      : displayStatus === 'Old Request' 
                      ? 'bg-gray-500/20 text-gray-400' 
                      : displayStatus === 'cancelled'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {displayStatus}
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => updateAppointmentStatus(apt._id, 'completed').then(() => {
                        fetchData();
                        showToast(`Marked ${apt.name}'s appointment as completed!`, 'success');
                      })} 
                      className="text-[10px] sm:text-xs font-black text-green-500 uppercase tracking-widest hover:underline cursor-pointer"
                    >
                      Completed
                    </button>
                    <button 
                      onClick={() => setConfirmModal({ isOpen: true, aptId: apt._id, aptName: apt.name })}
                      className="text-[10px] sm:text-xs font-black text-red-500 uppercase tracking-widest hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-6 text-xs sm:text-sm font-black uppercase tracking-widest opacity-60">Customer</th>
                <th className="p-6 text-xs sm:text-sm font-black uppercase tracking-widest opacity-60">Location</th>
                <th className="p-6 text-xs sm:text-sm font-black uppercase tracking-widest opacity-60">Date</th>
                <th className="p-6 text-xs sm:text-sm font-black uppercase tracking-widest opacity-60">Status</th>
                <th className="p-6 text-xs sm:text-sm font-black uppercase tracking-widest opacity-60">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((apt) => {
                const aptDate = new Date(apt.date);
                const isOld = apt.status === 'pending' && aptDate.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                const displayStatus = isOld ? 'Old Request' : apt.status;
                
                return (
                  <tr key={apt._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black uppercase text-sm">{apt.name}</span>
                        {apt.phone && (
                          <span className="text-[10px] opacity-50 tracking-widest font-semibold mt-0.5">📞 {apt.phone}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        apt.location === 'home' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {apt.location === 'home' ? '🏠 At Home' : '🏪 At Shop'}
                      </span>
                    </td>
                    <td className="p-6 text-sm opacity-60">{new Date(apt.date).toLocaleDateString()}</td>
                    <td className="p-6">
                      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                        displayStatus === 'completed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : displayStatus === 'Old Request' 
                          ? 'bg-gray-500/20 text-gray-400' 
                          : displayStatus === 'cancelled'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="p-6 flex gap-4">
                      <button 
                        onClick={() => updateAppointmentStatus(apt._id, 'completed').then(() => {
                          fetchData();
                          showToast(`Marked ${apt.name}'s appointment as completed!`, 'success');
                        })} 
                        className="text-xs font-black text-green-500 uppercase tracking-widest hover:underline cursor-pointer"
                      >
                        Completed
                      </button>
                      <button 
                        onClick={() => {
                          setConfirmModal({ isOpen: true, aptId: apt._id, aptName: apt.name });
                        }}
                        className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && (
          <div className="border-t border-white/10 rounded-b-2xl p-12 text-center text-xs sm:text-sm uppercase tracking-widest opacity-40">
            No appointments found
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-xl border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-xs font-black uppercase tracking-widest text-white/60">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Appointment"
        message={`This will permanently delete ${confirmModal.aptName}'s appointment. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep It"
        variant="danger"
        onConfirm={async () => {
          setConfirmModal({ isOpen: false, aptId: null, aptName: '' });
          try {
            await deleteAppointment(confirmModal.aptId);
            showToast(`Appointment deleted successfully.`, 'success');
            fetchData();
          } catch (err) {
            showToast('Failed to delete appointment.', 'error');
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, aptId: null, aptName: '' })}
      />
    </div>
  );
};

export default AdminAppointmentsPage;
