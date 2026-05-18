'use client';
import React from 'react';
import Navbar from './(users)/components/Navbar';
import Footer from './(users)/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* 404 Navbar matches the one in pic (Black on white) */}
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Massive 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter text-[#FFFBD1] select-none">
            404
          </h1>
          {/* Subtle gradient overlay to match image depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-black">
          OOPS! PAGE NOT FOUND
        </h2>

        {/* Description */}
        <p className="max-w-md text-sm md:text-base text-gray-400 font-medium leading-relaxed mb-10 italic">
          The page you're looking for doesn't exist or has been moved. Try going back to the homepage or explore our latest features.
        </p>

        {/* Back to Home Button */}
        <a 
          href="/" 
          className="px-10 py-4 bg-white border border-black text-black text-[11px] md:text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3"
        >
          BACK TO HOME
          <span className="text-base font-normal">↗</span>
        </a>
      </div>

      <Footer />
    </main>
  );
}
