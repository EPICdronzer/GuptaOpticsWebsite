'use client';
import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const categories = [
    {
      name: 'KIDS',
      color: 'bg-yellow-400',
      image: '/prod-1.png'
    },
    {
      name: 'WOMAN',
      color: 'bg-teal-500',
      image: '/eco-thumb.png'
    },
    {
      name: 'MAN',
      color: 'bg-orange-600',
      image: '/hero-bg.png'
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        nextSlide();
      }
    }, 5500);
    return () => clearInterval(interval);
  }, [activeIndex, mounted]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % categories.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);

  return (
    <section className="w-full bg-white px-12 md:px-32 lg:px-48 py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-20 gap-8 md:gap-12">
          <div className="flex flex-col items-center md:items-start gap-8 order-2 md:order-1 w-full md:w-auto">
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest max-w-[300px] text-center md:text-left">
              // From playful kid&apos;s shades to bold men&apos;s designs and chic women&apos;s collections.
            </p>
            {/* Mobile Controls */}
            <div className="flex gap-4 md:hidden">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          
          <div className="md:text-right order-1 md:order-2 w-full md:w-auto text-center md:text-right">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-black uppercase tracking-tighter leading-none">
              SHOP SUNGLASSES<br />
              <span className="text-gray-300">FOR EVERYONE</span>
            </h2>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="relative w-full">
          <div className="flex md:grid md:grid-cols-3 gap-8 transition-transform duration-700 ease-in-out"
               style={{ transform: mounted && window.innerWidth < 768 ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 32}px))` : 'none' }}>
            {categories.map((cat, idx) => (
              <div key={idx} className={`relative min-w-full md:min-w-0 aspect-[3/4] ${cat.color} group overflow-hidden cursor-pointer rounded-sm`}>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover mix-blend-multiply opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-full bg-white/20 backdrop-blur-xl border border-white/30 py-4 px-6 flex justify-between items-center group-hover:bg-white/40 transition-all duration-300">
                    <span className="text-sm font-black text-black uppercase tracking-[0.2em]">{cat.name}</span>
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {categories.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
