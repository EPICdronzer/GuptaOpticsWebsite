'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const StyleDiscover = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
      );
      gsap.fromTo(productsRef.current?.children ?? [],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: productsRef.current, start: 'top 80%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const products = [
    {
      id: 1,
      name: 'VELVET MOTION',
      price: '$ 119.00 USD',
      image: '/prod-1.png'
    },
    {
      id: 2,
      name: 'URBAN OPULENCE',
      price: '$ 99.00 USD',
      image: '/prod-2.png'
    },
    {
      id: 3,
      name: 'MODERN GRANDEUR',
      price: '$159.00 USD',
      image: '/prod-3.png'
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
    }, 4500);
    return () => clearInterval(interval);
  }, [activeIndex, mounted]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % products.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

  return (
    <section ref={sectionRef} className="w-full bg-[#f6f5f2] px-12 md:px-32 lg:px-48 py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        {/* Header */}
        <div ref={headingRef} className="w-full mb-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-black uppercase tracking-tighter leading-none mb-6">
              DISCOVER<br />
              SUNGLASSES FOR
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 overflow-hidden rounded-sm hidden md:block">
                  <img src="/eco-thumb.png" alt="Style detail" className="w-full h-full object-cover" />
                </div>
                <span className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-300 uppercase tracking-tighter leading-none">
                  EVERY STYLE
                </span>
              </div>
              <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest max-w-[200px] text-center md:text-left">
                // Explore our curated<br />selection of sunglasses
              </p>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-200 mb-12 md:mb-16"></div>

        {/* Controls (for Desktop/Tablet) */}
        <div className="w-full flex justify-end gap-4 mb-8 hidden md:flex">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">←</button>
          <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">→</button>
        </div>

        {/* Product Grid */}
        <div className="relative w-full mb-16 md:mb-20">
          <div ref={productsRef} className="flex md:grid md:grid-cols-3 gap-8 md:gap-12 transition-transform duration-700 ease-in-out"
               style={{ transform: mounted && window.innerWidth < 768 ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 32}px))` : 'none' }}>
            {products.map((product) => (
              <div key={product.id} className="min-w-full md:min-w-0 group cursor-pointer">
                <div className="relative aspect-square bg-white overflow-hidden mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-black uppercase tracking-tight">{product.name}</h4>
                  <span className="text-gray-400 font-bold text-[10px] tracking-widest">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Dots & Arrows */}
          <div className="flex flex-col items-center gap-6 mt-8 md:hidden">
            <div className="flex justify-center gap-2">
              {products.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
            <div className="flex gap-10">
                <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-xl">←</button>
                <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-xl">→</button>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <button className="group flex items-center gap-3 border border-black/20 px-10 py-4 rounded-sm hover:bg-black hover:text-white transition-all duration-300">
          <span className="text-sm font-black uppercase tracking-widest">View All</span>
          <svg className="w-4 h-4 transform group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default StyleDiscover;
