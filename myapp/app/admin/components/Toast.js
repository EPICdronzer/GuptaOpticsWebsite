'use client';
import React, { useEffect, useState } from 'react';

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const STYLES = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    bar: 'bg-emerald-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    bar: 'bg-red-400',
  },
  info: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: 'text-cyan-400',
    bar: 'bg-cyan-400',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    bar: 'bg-yellow-400',
  },
};

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose?.(), 350);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const style = STYLES[type] || STYLES.success;

  return (
    <div
      className={`
        fixed top-4 left-4 right-4 sm:left-auto sm:top-6 sm:right-6 z-[9999] sm:max-w-sm
        transition-all duration-300 ease-out
        ${visible && !exiting 
          ? 'translate-y-0 sm:translate-x-0 opacity-100' 
          : '-translate-y-4 sm:translate-y-0 sm:translate-x-4 opacity-0'
        }
      `}
    >
      <div className={`${style.bg} ${style.border} border backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/40 flex items-start gap-3 relative overflow-hidden`}>
        {/* Icon */}
        <div className={`${style.icon} flex-shrink-0 mt-0.5`}>
          {ICONS[type]}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white tracking-wide leading-snug">{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => onClose?.(), 350);
          }}
          className="text-white/40 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Animated progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            className={`h-full ${style.bar} rounded-full`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
