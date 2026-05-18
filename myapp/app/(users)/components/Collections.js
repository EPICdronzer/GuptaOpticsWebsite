'use client';
import React, { useState, useEffect, useRef } from 'react';

const Collections = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const features = [
    { name: 'CLARITY' },
    { name: 'CRAFTSMANSHIP' },
    { name: 'COMFORT' },
    { name: 'CONFIDENCE' },
  ];

  const products = [
    {
      id: 1,
      name: 'VELVET MOTION',
      price: '$119.00',
      image: '/prod-1.png'
    },
    {
      id: 2,
      name: 'URBAN OPULENCE',
      price: '$99.00',
      image: '/prod-2.png'
    },
    {
      id: 3,
      name: 'MODERN GRANDEUR',
      price: '$159.00',
      image: '/prod-3.png'
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll on mobile
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        nextSlide();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, mounted]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Feature bar marquee
  const displayFeatures = [...features, ...features, ...features, ...features];

  return (
    <div id="next-section" className="w-full bg-white">
      {/* Top Feature Bar */}
      <div className="bg-[#ffcc00] py-4 md:py-6 overflow-hidden">
        <div className="flex animate-marquee-fast md:justify-center items-center gap-12 whitespace-nowrap px-8">
          {displayFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-12">
              <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-black/80">{feature.name}</span>
              <div className="h-4 w-[1px] bg-black/10"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Section */}
      <section className="px-12 md:px-32 lg:px-48 py-16 md:py-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="text-center md:text-left w-full md:w-auto">
            <h3 className="text-sm md:text-2xl font-black text-gray-300 uppercase tracking-widest mb-4 md:mb-2">// EXPLORE</h3>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
              OUR COLLECTIONS
            </h2>
          </div>
          
          <div className="mt-8 md:mt-0 flex flex-col items-end gap-6">
            <div className="flex gap-4">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 group"
              >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 group"
              >
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            <p className="text-gray-400 font-medium tracking-tight hidden md:block">
              // Discover eyewear for every<br />mood, style, and occasion.
            </p>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-100 mb-12 md:mb-16"></div>

        {/* Product Grid */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="flex md:grid md:grid-cols-3 gap-8 md:gap-12 transition-transform duration-700 ease-in-out"
            style={{ transform: mounted && window.innerWidth < 768 ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 32}px))` : 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-full md:min-w-0 group cursor-pointer">
                <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-gray-100">
                  <h4 className="text-base md:text-lg font-black uppercase tracking-tight">{product.name}</h4>
                  <span className="text-gray-400 font-bold text-[10px] md:text-sm tracking-widest">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {products.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee-fast 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Collections;
