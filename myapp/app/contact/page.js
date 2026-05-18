'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../(users)/components/Navbar';
import Footer from '../(users)/components/Footer';
import { siteConfig } from '../config';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ContactPage = () => {
  const heroRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero: image slides left, form slides right
      const heroChildren = heroRef.current?.children ?? [];
      if (heroChildren[0]) gsap.fromTo(heroChildren[0], { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' });
      if (heroChildren[1]) gsap.fromTo(heroChildren[1], { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.2 });
      // Info cards stagger in
      gsap.fromTo(infoRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Reverted to standard scroll behavior */}
      <Navbar />
      
      {/* 1. Contact Hero Section */}
      <section className="relative w-full pt-20 overflow-hidden">
        <div ref={heroRef} className="flex flex-col lg:flex-row min-h-[70vh]">
          {/* Left: Image Side */}
          <div className="lg:w-1/2 relative bg-[#87CEEB]">
            <img 
              src="/prod-1.png" 
              alt="Contact Hero" 
              className="w-full h-full object-cover min-h-[500px]"
            />
          </div>

          {/* Right: Form Side */}
          <div className="lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white">
            <div className="w-full max-w-lg">
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 md:mb-12">
                CONTACT <span className="text-[#999999]">US</span>
              </h1>
              
              <form className="space-y-6">
                <div className="relative border-b border-black/10 pb-4 flex items-center gap-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input type="text" placeholder="Your Name*" className="w-full bg-transparent outline-none text-sm font-medium uppercase tracking-widest placeholder:text-gray-300" />
                </div>
                
                <div className="relative border-b border-black/10 pb-4 flex items-center gap-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="email" placeholder="Email Address*" className="w-full bg-transparent outline-none text-sm font-medium uppercase tracking-widest placeholder:text-gray-300" />
                </div>

                <div className="relative border-b border-black/10 pb-4 flex items-center gap-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <input type="tel" placeholder="Phone Number*" className="w-full bg-transparent outline-none text-sm font-medium uppercase tracking-widest placeholder:text-gray-300" />
                </div>

                <div className="relative border-b border-black/10 pb-4 flex items-start gap-4">
                  <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <textarea placeholder="Example Text" rows="4" className="w-full bg-transparent outline-none text-sm font-medium uppercase tracking-widest placeholder:text-gray-300 resize-none"></textarea>
                </div>

                <button className="w-full py-5 border border-black text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-black hover:text-white transition-all duration-500 mt-8">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Yellow Info Bar - Icons Removed */}
        <div className="bg-yellow-400 py-4 md:py-5 border-y border-black/10">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center items-center gap-4 md:gap-24 px-4 text-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">500,000+ 5 STAR REVIEWS</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-black/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">1-YEAR LIMITED WARRANTY</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-black/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">FREE PAN-INDIA SHIPPING</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Follow Us & Info Cards Section */}
      <section className="py-16 md:py-40 px-4 md:px-12 lg:px-32 xl:px-48 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Social Diamond Grid */}
          <div className="relative flex flex-col items-center justify-center text-center py-24 md:py-40 mb-16 md:mb-32 group">
            {/* Floating Images */}
            <img src="/prod-1.png" className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-32 lg:w-40 xl:w-48 aspect-square object-cover shadow-2xl transition-transform duration-700 group-hover:-translate-y-4" alt="Social 1" />
            <img src="/prod-2.png" className="absolute top-1/4 left-0 xl:left-10 w-16 md:w-28 lg:w-32 xl:w-40 aspect-square object-cover shadow-2xl transition-transform duration-700 group-hover:-translate-x-4" alt="Social 2" />
            <img src="/prod-3.png" className="absolute top-1/4 right-0 xl:right-10 w-16 md:w-28 lg:w-32 xl:w-40 aspect-square object-cover shadow-2xl transition-transform duration-700 group-hover:translate-x-4" alt="Social 3" />
            <img src="/prod-1.png" className="absolute bottom-1/4 left-4 xl:left-20 w-20 md:w-32 lg:w-40 xl:w-48 aspect-square object-cover shadow-2xl transition-transform duration-700 group-hover:-translate-x-4 translate-y-10" alt="Social 4" />
            <img src="/prod-2.png" className="absolute bottom-1/4 right-4 xl:right-20 w-20 md:w-32 lg:w-40 xl:w-48 aspect-square object-cover shadow-2xl transition-transform duration-700 group-hover:translate-x-4 translate-y-10" alt="Social 5" />
            <img src="/prod-3.png" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-28 lg:w-32 xl:w-40 aspect-square object-cover shadow-2xl transition-transform duration-700 group-hover:translate-y-4" alt="Social 6" />

            <div className="relative z-10 bg-white/80 xl:bg-transparent backdrop-blur-sm xl:backdrop-blur-none p-6 md:p-10 xl:p-0 rounded-none">
              <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-none max-w-3xl text-black xl:text-inherit">
                FOLLOW US<br />
                <span className="text-black/60 xl:text-[#999999]">FOR NEW COLLECTIONS</span><br />
                STYLE TIPS,<br />
                <span className="text-black/60 xl:text-[#999999]">AND EXCLUSIVE OFFERS</span>
              </h2>
            </div>
          </div>

          {/* Info Cards Grid - EXACT MATCH DESIGN */}
          <div ref={infoRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Card */}
            <div className="relative h-[400px] overflow-hidden group">
              <img src="/hero-bg.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Phone BG" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-[#333333]">
                <p className="text-[11px] font-medium uppercase mb-2">PHONE NUMBER</p>
                <p className="text-xl md:text-2xl font-bold leading-tight">+91 98765 43210</p>
                <p className="text-xl md:text-2xl font-bold leading-tight">+91 98765 01234</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="relative h-[400px] bg-yellow-400 overflow-hidden group">
              <img src="/prod-2.png" className="absolute top-0 left-0 w-full h-2/3 object-cover" alt="Location BG" />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400 via-yellow-400/80 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-[#333333]">
                <p className="text-[11px] font-medium uppercase mb-2">STORE LOCATION</p>
                <p className="text-xl md:text-2xl font-bold leading-tight">123 Vision Avenue,</p>
                <p className="text-xl md:text-2xl font-bold leading-tight">New Delhi, India</p>
              </div>
            </div>

            {/* Available Card */}
            <div className="relative h-[400px] overflow-hidden group">
              <img src="/prod-3.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Available BG" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-[#333333]">
                <p className="text-[11px] font-medium uppercase mb-2">AVAILABLE</p>
                <p className="text-xl md:text-2xl font-bold leading-tight">Monday–Friday 9 AM –</p>
                <p className="text-xl md:text-2xl font-bold leading-tight">6 PM (IST)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
