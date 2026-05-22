'use client';
import React, { useEffect, useState } from 'react';

const ConfirmModal = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm, 
  onCancel 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onCancel?.(), 250);
  };

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(() => onConfirm?.(), 250);
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-500/15 border-red-500/30',
      iconColor: 'text-red-400',
      confirmBtn: 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    warning: {
      iconBg: 'bg-yellow-500/15 border-yellow-500/30',
      iconColor: 'text-yellow-400',
      confirmBtn: 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      iconBg: 'bg-cyan-500/15 border-cyan-500/30',
      iconColor: 'text-cyan-400',
      confirmBtn: 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      ),
    },
  };

  const v = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-250 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div 
        className={`
          relative z-10 w-full max-w-md
          bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl
          border border-white/10 rounded-3xl 
          shadow-2xl shadow-black/60
          p-6 sm:p-8 text-center
          transition-all duration-250 ease-out
          ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        `}
      >
        {/* Icon */}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${v.iconBg} border ${v.iconColor} flex items-center justify-center mx-auto mb-4 sm:mb-5`}>
          {v.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-xs mx-auto">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${v.confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
