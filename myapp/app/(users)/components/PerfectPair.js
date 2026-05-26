'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const PerfectPair = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const rowsRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current?.children ?? [],
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
      );
      gsap.fromTo(rowsRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const items = [
    {
      id: 1,
      title: 'CLASSIC EVERYDAY SHADES',
      bg: 'bg-[#f6f5f2]',
      image: '/eco-thumb.png',
      description: '// From aviators to wayfarers, discover frames that never go out of style. Designed with lightweight materials and UV protection, these sunglasses keep you comfortable and stylish all day, every day.',
      tilt: 'rotate-6'
    },
    {
      id: 2,
      title: 'CLASSIC EVERYDAY SHADES',
      bg: 'bg-white',
      image: '/hero-bg.png',
      description: '// Precision-engineered lens design powered by AI diagnostics in collaboration with leading Indian clinics. Experience zero aberration and high contrast vision tailored for you.',
      tilt: '-rotate-6'
    },
    {
      id: 3,
      title: 'CLASSIC EVERYDAY SHADES',
      image: '/clarity-macro.png',
      bg: 'bg-[#ffcc00]',
      description: '// Indias finest craftsmanship combined with AI testing protocols. Experience the future of optometry with custom lenses engineered for unmatched visual clarity and comfort.',
      tilt: 'rotate-3'
    }
  ];

  return (
    <section ref={sectionRef} className="w-full bg-white px-4 md:px-32 lg:px-48 py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-start mb-12">
          <h2 className="text-4xl md:text-7xl font-bold text-black uppercase tracking-tighter leading-none">
            READY TO<br />
            <span className="text-gray-400">FIND YOUR</span><br />
            PERFECT PAIR?
          </h2>
          
          <div className="mt-8 md:mt-0 flex items-center gap-6">
            <div className="w-24 h-24 overflow-hidden rounded-sm">
              <img src="/hero-bg.png" alt="Perfect pair detail" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-400 font-medium tracking-tight max-w-[200px]">
              // Shop our latest<br />collection and see<br />the difference.
            </p>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-100 mb-12"></div>

        {/* Rows Wrapper with Carousel Overflow Handling */}
        <div className="relative w-full overflow-hidden">
          <div 
            ref={rowsRef} 
            className="flex md:flex-col gap-8 transition-transform duration-500 ease-in-out"
            style={{ 
              transform: mounted && typeof window !== 'undefined' && window.innerWidth < 768 
                ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 32}px))` 
                : 'none' 
            }}
          >
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`${item.bg} p-6 md:p-12 flex flex-col md:flex-row justify-between items-center group cursor-pointer transition-all duration-500 min-w-full md:min-w-0`}
              >
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-base md:text-2xl font-black uppercase tracking-tight mb-4 md:mb-6">{item.title}</h3>
                  <p className="text-[11px] md:text-sm font-bold text-black/60 uppercase leading-relaxed tracking-wider mb-6 md:mb-0">
                    {item.description}
                  </p>
                </div>
                
                <div className="mt-2 md:mt-0 flex justify-center items-center w-full md:w-auto">
                  <div className={`w-full h-32 md:w-48 md:h-48 overflow-hidden rounded-sm transition-transform duration-500 group-hover:scale-110 md:${item.tilt}`}>
                    {item.video ? (
                      <video
                        src={item.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={item.image} alt="Collection detail" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots & Arrows */}
        <div className="flex flex-col items-center gap-4 mt-8 md:hidden">
          <div className="flex justify-center gap-2">
            {items.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-lg hover:bg-black hover:text-white transition-all"
            >
              ←
            </button>
            <button 
              onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-lg hover:bg-black hover:text-white transition-all"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PerfectPair;
