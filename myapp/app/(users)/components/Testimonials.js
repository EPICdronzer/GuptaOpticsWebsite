'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { generateStaticReviews } from './StaticReviewsData';
import Link from 'next/link';
import Script from 'next/script';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const [useFallback, setUseFallback] = useState(false);
  const [staticReviews, setStaticReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Generate reviews on mount so random dates are fresh per refresh
    setStaticReviews(generateStaticReviews(1000).slice(0, 15)); // Use a subset for the carousel
    
    // Check if Elfsight widget loads properly
    const timer = setTimeout(() => {
      if (widgetRef.current) {
        // If the widget container is empty or very small, it likely failed to load (limit reached)
        if (widgetRef.current.innerHTML.trim() === '' || widgetRef.current.clientHeight < 50) {
          setUseFallback(true);
        }
      }
    }, 4000); // Wait 4 seconds for Elfsight to load

    return () => clearTimeout(timer);
  }, []);

  // For the static fallback carousel
  useEffect(() => {
    if (!useFallback) return;
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        setActiveIndex((prev) => (prev + 1) % staticReviews.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [useFallback, staticReviews.length]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % staticReviews.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + staticReviews.length) % staticReviews.length);

  return (
    <section ref={sectionRef} className="w-full bg-[#f8f8f8] px-4 md:px-12 lg:px-32 py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left gap-6">
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight">
            Google Reviews
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span>5.0</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                   <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-gray-500 font-normal text-sm ml-1">(1,000+)</span>
            </div>
            <Link href="/reviews" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors whitespace-nowrap">
              Review us on Google
            </Link>
          </div>
        </div>

        {/* Global style to hide Elfsight arrows as requested */}
        <style dangerouslySetInnerHTML={{__html: `
          .elfsight-app-aceca5ea-4cce-4583-a905-579dc33638c0 .eapps-widget-toolbar,
          .elfsight-app-aceca5ea-4cce-4583-a905-579dc33638c0 [class*="Carousel__Arrow"] {
            display: none !important;
          }
        `}} />

        {!useFallback ? (
          <div ref={widgetRef} className="w-full min-h-[250px] relative">
            <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-aceca5ea-4cce-4583-a905-579dc33638c0" data-elfsight-app-lazy></div>
          </div>
        ) : (
          /* FALLBACK UI - Styled exactly like Google Reviews */
          <div className="relative w-full overflow-hidden pb-10">
            <div className="flex gap-6 transition-transform duration-500 ease-in-out"
                 style={{ transform: typeof window !== 'undefined' && window.innerWidth < 768 ? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 24}px))` : 'none' }}>
              
              {staticReviews.map((review) => (
                <div key={review.id} className="min-w-full md:min-w-[320px] max-w-[320px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-lg">
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                      <p className="text-gray-500 text-xs">{review.date}</p>
                    </div>
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 fill-current ${i >= review.rating ? 'text-gray-300' : ''}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-snug line-clamp-4">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile Fallback Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {staticReviews.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}></div>
              ))}
            </div>
            
            {/* Desktop Arrows */}
            <div className="hidden md:flex justify-end gap-3 mt-6">
               <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
               </button>
               <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
               </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
