'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);

  // GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
      );
      gsap.fromTo(cardsRef.current?.children ?? [],
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const cards = [
    {
      title: "100% UV PROTECTION",
      desc: "Keep your eyes safe from harmful UVA & UVB rays. Whether you're on the beach, driving, or outdoors, our lenses are designed to protect your vision."
    },
    {
      title: "ACTIVE INGREDIENTS",
      desc: "No more glare from roads, water, or reflective surfaces. Polarized lenses enhance contrast and sharpen details, making them perfect for both city life."
    },
    {
      title: "CLINICAL TESTING",
      desc: "Life happens — but your lenses shouldn't suffer. Our scratch-resistant coating ensures durability, keeping your glasses looking brand."
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
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, mounted]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % cards.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);

  return (
    <section ref={sectionRef} className="w-full bg-[#ffcc00] px-12 md:px-32 lg:px-48 py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Header */}
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12 md:mb-20">
          <div className="flex flex-col gap-6 w-full md:w-auto items-center md:items-start">
            <div className="w-48 h-32 overflow-hidden rounded-sm bg-black/5">
              <img src="/clarity-macro.png" alt="Macro lens detail" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
            </div>
            <p className="text-sm font-black text-black/60 max-w-[200px] uppercase leading-relaxed tracking-wider text-center md:text-left">
              // Every pair is built with advanced technology and crafted details
            </p>
          </div>
          
          <div className="flex-1 text-center md:text-right w-full">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-black leading-[0.85] tracking-tighter uppercase">
              EYEWEAR DESIGNED<br />FOR CLARITY AND<br />
              <span className="text-black/30">CONFIDENCE</span>
            </h2>
          </div>
        </div>

        {/* Know More Button (Mobile Only) */}
        <div className="flex justify-center md:hidden mb-12">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 border-2 border-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-black hover:text-[#ffcc00] transition-all duration-300"
          >
            {isExpanded ? 'Show Less' : 'Know More'}
            <svg 
              className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="h-[1px] w-full bg-black/10 mb-20 hidden md:block"></div>

        {/* Expandable Content Container - Always visible on md and up */}
        <div className={`transition-all duration-700 ease-in-out md:max-h-none md:opacity-100 md:visible md:overflow-visible ${isExpanded ? 'max-h-[3000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden md:block'}`}>
          {/* Middle Content */}
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 flex flex-col gap-12 text-center md:text-left">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-black uppercase tracking-[0.2em]">//CRAFTED FOR COMFORT</h3>
                <p className="text-sm font-bold text-black/60 max-w-xl mx-auto md:mx-0 uppercase leading-relaxed tracking-wider">
                  // Every pair is built with advanced technology and crafted details — so you can see clearly, feel comfortable, and look your best every day.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 aspect-square bg-black/5 rounded-sm overflow-hidden">
                   <img src="/prod-3.png" alt="Featured frame" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>
                <div className="flex-1 aspect-square bg-black/5 rounded-sm overflow-hidden flex items-center justify-center p-8">
                   <img src="/prod-2.png" alt="Frame detail" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
                </div>
              </div>

              <div className="h-[1px] w-full bg-black/10"></div>

              <p className="text-sm font-black text-black/80 max-w-2xl mx-auto md:mx-0 leading-relaxed tracking-wide uppercase">
                Our eyewear is more than just stylish frames — it&apos;s a blend of advanced lens technology, lightweight comfort, and premium craftsmanship. Designed to protect your eyes, elevate your look, and fit seamlessly into your lifestyle, every pair delivers the perfect balance of fashion.
              </p>
            </div>

            <div className="flex-1 lg:max-w-xl">
              <div className="aspect-[4/5] bg-black/5 rounded-sm overflow-hidden relative group">
                <img src="/hero-bg.png" alt="Lifestyle portrait" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-yellow-400/10 mix-blend-overlay"></div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Cards */}
          <div className="relative w-full mt-16 md:mt-24">
            <div ref={cardsRef} className="flex md:grid md:grid-cols-3 gap-8 transition-transform duration-700 ease-in-out"
                 style={{ transform: mounted && window.innerWidth < 768 ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 32}px))` : 'none' }}>
              {cards.map((card, i) => (
                <div key={i} className="min-w-full md:min-w-0 p-10 border border-black/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <h4 className="text-base font-black mb-4 uppercase tracking-widest">{card.title}</h4>
                  <p className="text-sm font-bold text-black/60 leading-relaxed tracking-tight uppercase">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Mobile Controls */}
            <div className="flex justify-between items-center mt-10 md:hidden">
              <div className="flex gap-2">
                {cards.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-black/20'}`}></div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center">←</button>
                <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
