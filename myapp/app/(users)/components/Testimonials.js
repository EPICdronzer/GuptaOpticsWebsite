'use client';
import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const reviews = [
    {
      id: 1,
      name: 'MICHAEL R.',
      date: '1 month ago',
      text: "I've never owned sunglasses that feel this good. They're lightweight, stylish, and I can wear them all day without discomfort. Eyeconic nailed it.",
      initials: 'MR'
    },
    {
      id: 2,
      name: 'SOPHIA T.',
      date: '4 days ago',
      text: "I bought a pair for vacation, and now I wear them everywhere. People keep asking me where I got them—Eyeconic is officially my style secret.",
      initials: 'ST'
    },
    {
      id: 3,
      name: 'AMELIA R.',
      date: '2 months ago',
      text: "Eyeconic sunglasses completely changed how I see eyewear. They're stylish, lightweight, and I forget I'm even wearing them.",
      initials: 'AR'
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
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex, mounted]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="w-full bg-[#f8f8f8] px-12 md:px-32 lg:px-48 py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="text-center md:text-left w-full md:w-auto">
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
              OUR CUSTOMERS<br />
              <span className="text-gray-300">ARE SAYING</span>
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
              // Loved by thousands of<br />happy customers worldwide.
            </p>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-200 mb-12 md:mb-16"></div>

        {/* Testimonial Cards */}
        <div className="relative w-full">
          <div className="flex md:grid md:grid-cols-3 gap-8 transition-transform duration-700 ease-in-out"
               style={{ transform: mounted && window.innerWidth < 768 ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 32}px))` : 'none' }}>
            {reviews.map((review) => (
              <div key={review.id} className="min-w-full md:min-w-0 bg-white p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-5xl font-serif text-gray-200 group-hover:text-yellow-400 transition-colors">“</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 font-bold leading-relaxed mb-10 min-h-[100px] text-sm uppercase tracking-wide">
                  &quot;{review.text}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-300 border border-gray-200 group-hover:bg-black group-hover:text-white transition-all duration-300 text-xs">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tight">{review.name}</h4>
                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Dots */}
          <div className="flex justify-center gap-2 mt-10 md:hidden">
            {reviews.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
