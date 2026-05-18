'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ParallaxCTA = () => {
  const [scrollY, setScrollY] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 85%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother performance
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax factor
  const offset = scrollY * 0.15;

  return (
    <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center bg-[#e5e7eb]">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 scale-125"
        style={{ 
          transform: `translateY(${offset % 150}px)`,
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(4px) brightness(0.9)'
        }}
      ></div>

      {/* Center Content Card */}
      <div ref={cardRef} className="relative z-10 bg-white shadow-2xl w-[90%] max-w-[450px] flex flex-col items-center">
        <div className="w-full p-4">
            <div className="w-full aspect-[4/3] overflow-hidden border-[6px] border-white shadow-sm">
                <img 
                    src="/eco-thumb.png" 
                    alt="New arrival detail" 
                    className="w-full h-full object-cover" 
                />
            </div>
        </div>
        
        <div className="px-8 pb-12 pt-4 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-black">
                SEE WHAT&apos;S NEXT
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10 leading-relaxed max-w-[280px] mx-auto">
                // Discover eyewear for every mood, style, and occasion.
            </p>
            
            <button className="group flex items-center gap-3 border border-black/10 px-10 py-3.5 rounded-sm hover:bg-black hover:text-white transition-all duration-300 mx-auto">
                <span className="text-[11px] font-black uppercase tracking-widest">Shop New Arrivals</span>
                <svg className="w-4 h-4 transform group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
      </div>

      {/* Floating Icon (Bottom Left as in reference) */}
      <div className="absolute bottom-10 left-10 z-20">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/20">
            <span className="text-white font-black text-xs">N</span>
        </div>
      </div>
    </section>
  );
};

export default ParallaxCTA;
