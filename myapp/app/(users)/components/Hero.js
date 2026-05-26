'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteConfig } from '../../config';
import { createAppointment } from '../../../actions/clientActions';

const Hero = () => {
  const [formData, setFormData] = useState({ name: '', date: '', location: 'shop' });
  const [minDate, setMinDate] = useState('');
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const bottomRef = useRef(null);
  const scrollBtnRef = useRef(null);

  // GSAP page load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1 }
      )
      .fromTo(formRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        '-=0.6'
      )
      .fromTo(bottomRef.current?.children ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
        '-=0.4'
      )
      .fromTo(scrollBtnRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.6 },
        '-=0.3'
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Set minimum date to today for the calendar picker
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) return;
    
    // 1. Save to Backend
    await createAppointment(formData);

    // 2. Prepare WhatsApp Redirect
    const formattedDate = new Date(formData.date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const locationText = formData.location === 'home' ? 'At Home' : 'At Shop';

    const message = `Hello Optical Galaxy! I would like to book an eye test appointment.
    
Name: ${formData.name}
Preferred Date: ${formattedDate}
Location: ${locationText}`;

    const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-24 lg:px-48 text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Sticky Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-fixed"
        aria-hidden="true"
      ></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full pt-12 md:pt-32">
        {/* Top Section: Title and Form */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
          <div ref={titleRef} className="title-container max-w-2xl">
            <h1 className="text-[3.2rem] md:text-[6rem] lg:text-[7.5rem] font-black leading-[0.85] tracking-tighter uppercase mb-6 md:mb-0">
              SHADES<br />OF STYLE
            </h1>
          </div>
          
          {/* Booking Form (Replacing the Categories List) */}
          <div ref={formRef} className="mt-2 md:mt-0 w-full md:w-[320px] bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400 mb-4 md:mb-6">Book An Eye Test</h3>
            
            <form onSubmit={handleBooking} className="flex flex-col gap-4 text-left">
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="location" 
                    value="shop" 
                    checked={formData.location === 'shop'}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="accent-yellow-400"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">At Shop</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="location" 
                    value="home"
                    checked={formData.location === 'home'}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="accent-yellow-400"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">At Home</span>
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest opacity-50 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="YOUR NAME"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border border-white/20 px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-white/40 text-white w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest opacity-50 ml-1">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="bg-white/5 border border-white/20 px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-yellow-400 transition-colors text-white w-full min-h-[42px]"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <button 
                type="submit"
                className="mt-2 bg-yellow-400 hover:bg-white text-black py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
              >
                Confirm via WhatsApp
              </button>
            </form>
          </div>
        </div>

        {/* Center/Bottom Content */}
        <div ref={bottomRef} className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-12 pb-6 md:pb-12 text-center md:text-left">
          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-3 order-1 md:order-2 w-full md:w-auto mt-4 md:mt-0">
            {/* Locate Us Button */}
            <a 
              href={siteConfig.address.googleMaps} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black px-8 py-3 md:px-6 md:py-3 rounded-full transition-all duration-300 shadow-xl group w-full md:w-auto justify-center"
            >
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Locate Us</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-current">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a 
              href={`https://wa.me/${siteConfig.contact.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] px-8 py-3 md:px-6 md:py-3 rounded-full transition-all duration-300 shadow-2xl group w-full md:w-auto justify-center"
            >
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">WhatsApp</span>
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
            </a>
          </div>

          {/* Description */}
          <div className="max-w-xs order-2 md:order-1 mt-4 md:mt-0">
            <p className="text-[11px] md:text-xl font-black uppercase leading-tight opacity-90 tracking-[0.1em]">
              Cool glasses that blend<br className="hidden md:block" /> style and comfort for all.
            </p>
          </div>
        </div>
      </div>

      {/* Absolute Bottom Center Scroll Button - Hidden on mobile */}
      <div className="hidden md:flex absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20">
          <button 
            ref={scrollBtnRef}
            onClick={scrollToNextSection}
            className="w-14 h-14 md:w-20 md:h-20 border border-white/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 group outline-none bg-white/5 backdrop-blur-sm shadow-2xl"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-80 group-hover:opacity-100 transition-all duration-300">Scroll</span>
          </button>
      </div>
    </section>
  );
};

export default Hero;
