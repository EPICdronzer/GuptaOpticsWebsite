import React from 'react';

// Reusable styled select component with glassmorphic appearance
// Props:
// - options: array of { value: string, label: string }
// - value: current selected value
// - onChange: (e) => void, receives event from underlying <select>
// - placeholder: optional placeholder text shown as first disabled option
// - className: optional additional classes
export default function StyledSelect({ options, value, onChange, placeholder, className = '' }) {
  return (
    <div className={`relative ${className}`}> 
      <select
        value={value}
        onChange={onChange}
        className="appearance-none w-full bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none transition-colors text-white cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Arrow Icon */}
      <svg className="pointer-events-none absolute right-3 top-1/2 -mt-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
