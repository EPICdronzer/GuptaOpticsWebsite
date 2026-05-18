'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ContactCTA = () => {
  const badges = [
    { name: 'ECO-FRIENDLY APPROACH' },
    { name: 'HAND-FINISHED CRAFTSMANSHIP' },
    { name: 'PREMIUM MATERIALS' },
    { name: '100% UV PROTECTION' },
  ];
  const scrollingBadges = [...badges, ...badges, ...badges];
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } }
      );
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col justify-between overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/eco-thumb.png')] bg-cover bg-center bg-fixed"
        aria-hidden="true"
      >
        {/* Dark Overlay to make text pop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 py-24">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tighter uppercase max-w-4xl">
          REACH OUT <span className="text-yellow-400">TODAY</span> AND<br />
          LET&apos;S START THE CONVERSATION
        </h2>
        
        <button className="mt-12 group flex items-center gap-3 border border-white/30 px-8 py-4 rounded-sm hover:bg-white transition-all duration-300">
          <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-black transition-colors">Contact Us</span>
          <svg 
            className="w-4 h-4 text-white group-hover:text-black transform group-hover:rotate-45 transition-all duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Auto Swiper / Infinite Marquee */}
      <div className="relative z-10 w-full bg-black/40 backdrop-blur-md border-t border-white/10 py-8 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {scrollingBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-4 mx-12">
              <span className="text-sm font-black text-white uppercase tracking-widest">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind Custom Animation Style */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ContactCTA;
