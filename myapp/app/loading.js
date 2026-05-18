import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-8">
      {/* Premium Spinner */}
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-t-2 border-r-2 border-yellow-400 rounded-full animate-spin"></div>
        {/* Inner Ring */}
        <div className="absolute inset-4 border-b-2 border-l-2 border-white/20 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        {/* Center Pulsing Dot */}
        <div className="absolute inset-[45%] bg-yellow-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.5)]"></div>
      </div>

      {/* Brand Label */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-black uppercase tracking-[0.5em] text-white animate-pulse">
          Optical GALAXY
        </h2>
        <div className="w-12 h-[1px] bg-yellow-400 mt-2 animate-[scaleX_2s_ease-in-out_infinite]"></div>
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
        Loading Premium Experience
      </p>
    </div>
  );
}
