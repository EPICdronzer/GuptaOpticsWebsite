'use client';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../(users)/components/Navbar';
import Footer from '../(users)/components/Footer';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroTitleRef = useRef(null);
  const statsRef = useRef(null);
  const brandRef = useRef(null);
  const visionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title staggered
      gsap.fromTo(heroTitleRef.current?.children ?? [],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
      // Stats counter-like entrance
      gsap.fromTo(statsRef.current?.children ?? [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
      );
      // Brand section
      gsap.fromTo(brandRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: brandRef.current, start: 'top 85%' } }
      );
      // Vision section
      gsap.fromTo(visionRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: visionRef.current, start: 'top 85%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      text: "I bought a pair for vacation, and now I wear them everywhere. People keep asking me where I got them —Optical Galaxy is officially my style secret.",
      author: "SOPHIA T.",
      date: "4 days ago",
      img: "/prod-1.png"
    },
    {
      text: "The craftsmanship is unmatched. I've tried many luxury brands, but Optical Galaxy's attention to detail and comfort is on another level.",
      author: "MARCUS R.",
      date: "1 week ago",
      img: "/prod-2.png"
    },
    {
      text: "Sustainable, stylish, and perfect fit. I love that I can look good while supporting a brand that cares about the planet.",
      author: "ELENA G.",
      date: "2 days ago",
      img: "/prod-3.png"
    }
  ];

  const stackingCards = [
    { id: 1, title: 'PREMIUM MATERIALS', img: '/prod-1.png' },
    { id: 2, title: '100% UV PROTECTION', img: '/prod-2.png' },
    { id: 3, title: 'ECO-FRIENDLY APPROACH', img: '/prod-3.png' }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main className="min-h-screen bg-[#F9F9F7]">
      <Navbar />
      
      {/* 1. About Hero Section */}
      <section className="pt-32 md:pt-48 pb-16 px-12 md:px-32 lg:px-48">
        <div className="max-w-[1400px] mx-auto">
          <div ref={heroTitleRef} className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <h1 className="text-5xl md:text-[7rem] font-black tracking-tighter leading-none uppercase">
              ABOUT <span className="text-[#999999]">US</span>
            </h1>
            <div className="max-w-xs md:pt-8">
              <p className="text-base md:text-lg font-medium text-[#777777] leading-relaxed italic">
                // We believe eyewear should be more than a necessity
              </p>
            </div>
          </div>
          
          <div className="relative w-full aspect-[21/9] bg-gray-200 overflow-hidden rounded-sm group cursor-pointer border border-black/5 shadow-2xl">
            <img 
              src="/hero-bg.png" 
              alt="About Video Thumbnail" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current translate-x-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-20 md:py-32 px-12 md:px-32 lg:px-48 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">OUR STORY</h2>
            <p className="text-[#777777] text-sm md:text-base leading-relaxed max-w-2xl">
              It all started with a simple idea: great vision deserves great design. Frustrated by eyewear that was either overpriced or lacking in quality, we set out to create something better—frames that deliver luxury craftsmanship, modern style, and everyday comfort without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 flex flex-col gap-5">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden shadow-xl">
                <img src="/prod-1.png" alt="Leo Carter" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-black text-black">Leo Carter</h4>
                <p className="text-gray-400 text-xs font-medium">Founder</p>
              </div>
            </div>

            <div className="md:col-span-1 flex flex-col gap-5">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden shadow-xl">
                <img src="/prod-2.png" alt="Maya Brooks" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-black text-black">Maya Brooks</h4>
                <p className="text-gray-400 text-xs font-medium">Co-Founder</p>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-5">
              <div className="aspect-[16/9] md:aspect-auto md:h-full bg-gray-100 overflow-hidden shadow-xl">
                <img src="/hero-bg.png" alt="The Team" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Card Stacking Section */}
      <section className="bg-[#F9F9F7] px-12 md:px-32 lg:px-48 py-24">
        <div className="max-w-[1400px] mx-auto">
          <div ref={brandRef} className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10">
            <div className="max-w-xs">
              <p className="text-sm font-medium text-[#777777] leading-relaxed italic">
                // Every pair of Optical Galaxy sunglasses is crafted with care to balance timeless style
              </p>
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-right leading-[0.85]">
              DESIGNED FOR YOUR<br /><span className="text-[#999999]">LIFESTYLE</span>
            </h2>
          </div>

          <div className="flex flex-col gap-[10vh]">
            {stackingCards.map((card, i) => (
              <div 
                key={card.id} 
                className="sticky top-[15vh] w-full aspect-[21/9] md:aspect-[21/8] shadow-2xl rounded-sm overflow-hidden group border border-black/5"
                style={{ top: `${15 + i * 2}vh` }}
              >
                <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent"></div>
                <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-white transition-all duration-500 group-hover:scale-110">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-current flex items-center justify-center">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{card.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats & Testimonial Section (Yellow) */}
      <section className="py-16 md:py-24 px-12 md:px-32 lg:px-48 bg-yellow-400">
        <div className="max-w-[1400px] mx-auto">
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
            {[
              { val: '10K+', label: 'Happy Customers Worldwide' },
              { val: '99%', label: 'UV Protection Guarantee' },
              { val: '80+', label: 'Frame Styles Designed' },
              { val: '30', label: 'Days Hassle-Free Returns' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 md:p-8 flex flex-col gap-3 aspect-square justify-center transition-all duration-500 hover:bg-black hover:text-white group cursor-default shadow-xl">
                <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center group-hover:bg-white/10">
                  <div className="w-5 h-5 border-2 border-yellow-600 rounded-full group-hover:border-white"></div>
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-105">{stat.val}</h3>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
            <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V13.5H12.017V9C12.017 6.23858 14.2556 4 17.017 4H19.017C21.7784 4 24.017 6.23858 24.017 9V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0 21L0 18C0 16.8954 0.89543 16 2.00002 16H5.00002C5.5523 16 6.00002 15.5523 6.00002 15V9C6.00002 8.44772 5.5523 8 5.00002 8H1.00002C0.447737 8 0 8.44772 0 9V13.5H2.00002V9C2.00002 6.23858 4.2386 4 7.00002 4H9.00002C11.7614 4 14.0001 6.23858 14.0001 9V15C14.0001 18.3137 11.3137 21 8.00002 21H0Z" />
            </svg>
            <div className="min-h-[120px] flex items-center justify-center">
              <h2 className="text-xl md:text-3xl font-black tracking-tight leading-snug transition-opacity duration-500">
                "{testimonials[currentTestimonial].text}"
              </h2>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-lg transition-transform duration-500 hover:scale-110">
                <img 
                  src={testimonials[currentTestimonial].img} 
                  alt={testimonials[currentTestimonial].author} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{testimonials[currentTestimonial].author}</p>
                <p className="text-[9px] font-medium text-black/40 uppercase">{testimonials[currentTestimonial].date}</p>
              </div>
            </div>
            
            {/* Interactive Slider Indicator */}
            <div className="w-full flex items-center justify-between mt-8 gap-6">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              >
                ←
              </button>
              <div className="flex-1 h-[1px] bg-black/10 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-black transition-all duration-500" 
                  style={{ width: `${((currentTestimonial + 1) / testimonials.length) * 100}%` }}
                ></div>
              </div>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Vision Section */}
      <section className="py-20 md:py-32 px-12 md:px-32 lg:px-48 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">OUR VISION</h2>
            <p className="text-[#777777] text-sm md:text-base leading-relaxed max-w-2xl italic">
              // We're not just creating eyewear—we're creating a movement. At Optical Galaxy, we envision a world where eyewear is more than an accessory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F9F9F7] p-10 md:p-16 flex flex-col gap-8 transition-all duration-500 hover:bg-black hover:text-white group cursor-default shadow-sm hover:shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">CRAFTSMANSHIP THAT MATTERS</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed group-hover:text-white/70 transition-colors">
                  Behind every pair of Optical Galaxy sunglasses is a story of precision and passion. From the careful selection of durable materials to the hand-finished details.
                </p>
              </div>
            </div>

            <div className="bg-black text-white p-10 md:p-16 flex flex-col gap-8 transition-all duration-500 hover:bg-yellow-400 hover:text-black group cursor-default shadow-xl hover:shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black transition-all duration-500 group-hover:bg-black group-hover:text-yellow-400 group-hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">SUSTAINABILITY PROMISE</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed opacity-80 group-hover:text-black group-hover:opacity-100 transition-all duration-500">
                  Protecting your vision also means protecting the planet. That's why Optical Galaxy uses eco-conscious packaging and responsibly sourced materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Last Section: Shop New Arrivals */}
      <section className="relative w-full overflow-hidden">
        {/* Swiper-style Marquee Yellow Bar - Icons Removed */}
        <div className="bg-yellow-400 py-4 flex items-center border-y border-black/10 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-black px-8 md:px-12">CLARITY</span>
                <span className="text-black/20 font-light text-xl">|</span>
                <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-black px-8 md:px-12">COMFORT</span>
                <span className="text-black/20 font-light text-xl">|</span>
                <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-black px-8 md:px-12">CRAFTSMANSHIP</span>
                <span className="text-black/20 font-light text-xl">|</span>
                <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-black px-8 md:px-12">CONFIDENCE</span>
                <span className="text-black/20 font-light text-xl">|</span>
              </div>
            ))}
          </div>
        </div>

        {/* Large Background Image Section with Centered Card */}
        <div className="relative w-full h-[80vh] md:h-screen flex items-center justify-center">
          <img src="/hero-bg.png" alt="What's Next Background" className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]" />
          <div className="absolute inset-0 bg-black/5"></div>
          
          {/* Centered Floating Card */}
          <div className="relative z-10 bg-white p-8 md:p-12 w-[90%] md:w-[600px] flex flex-col items-center text-center shadow-2xl border border-black/5 group overflow-hidden">
            <div className="relative w-full aspect-[4/3] bg-gray-100 mb-10 overflow-hidden border border-black/10">
              <img src="/prod-1.png" alt="Close up" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">SEE WHAT'S NEXT</h2>
            <p className="text-gray-400 text-sm md:text-base font-medium mb-10 leading-relaxed italic">
              // Discover eyewear for every mood, style, and occasion.
            </p>
            
            <a 
              href="/shop?tag=new"
              className="px-10 py-4 bg-transparent border border-black text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3"
            >
              SHOP NEW ARRIVALS
              <span className="text-base font-normal">↗</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
