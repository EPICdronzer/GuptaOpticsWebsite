'use client';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../../config';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const [message, setMessage] = useState('');
  const footerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(gridRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 90%' } }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || "Hi! I'm interested in Optical Galaxy sunglasses.");
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodedMessage}`, '_blank');
  };

  // Helper to get first word and rest of brand name
  const words = siteConfig.name.split(' ');
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');

  return (
    <footer ref={footerRef} className="relative w-full bg-[#080808] text-white pt-32 pb-12 px-6 md:px-12 lg:px-32 overflow-hidden border-t border-white/10">
      
      {/* Background Radial Gradient & Watermark */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.05),_transparent_50%)] pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 opacity-[0.02] pointer-events-none select-none">
        <h1 className="text-[15rem] font-black leading-none uppercase">{firstWord}</h1>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
          
          {/* Left Side: Brand & CTA (Spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <span className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] block">
                <span className="text-yellow-400">{firstWord}</span>
                {restWords && <><br /><span className="text-white">{restWords}</span></>}
              </span>
            </div>
            
            <div className="max-w-md flex flex-col gap-5 mt-4">
              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/70">
                WHATSAPP US TO GET 15% OFF YOUR FIRST PAIR
              </h4>
              
              <div className="relative flex items-center w-full bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-yellow-400 focus-within:bg-white/10 transition-all duration-500 shadow-2xl">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="w-full bg-transparent pl-6 pr-32 py-4 text-sm font-medium focus:outline-none text-white placeholder-white/40"
                />
                <button 
                  onClick={handleWhatsAppClick}
                  className="absolute right-1 top-1 bottom-1 bg-yellow-400 text-black px-6 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 hidden sm:block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  SEND
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Links (Spans 7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8 pt-4">
            {/* Main Pages */}
            <div className="flex flex-col gap-8">
              <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">MAIN PAGES</h5>
              <ul className="flex flex-col gap-5">
                {[
                  { name: 'Home', link: '/' },
                  { name: 'Shop', link: siteConfig.links.shop },
                  { name: 'About', link: siteConfig.links.about },
                  { name: 'Contact', link: siteConfig.links.contact },
                  { name: 'Terms', link: '/terms' },
                  { name: 'Privacy', link: '/privacy' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.link} className="group inline-flex text-[11px] font-black uppercase tracking-widest transition-colors text-white hover:text-yellow-400">
                      <span className="relative">
                        {item.name}
                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="flex flex-col gap-8">
              <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">SOCIAL</h5>
              <ul className="flex flex-col gap-5">
                {Object.entries(siteConfig.social).map(([platform, url]) => (
                  <li key={platform}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-yellow-400 transition-colors">
                      <span className="relative">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-8 mt-8 md:mt-0">
              <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">CONTACT</h5>
              <ul className="flex flex-col gap-5">
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-yellow-400 transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-yellow-400 transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black uppercase tracking-widest text-[#25D366] hover:brightness-125 transition-colors flex items-center gap-2 group">
                    <span className="relative w-2 h-2">
                      <span className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></span>
                      <span className="relative block w-2 h-2 bg-[#25D366] rounded-full"></span>
                    </span>
                    <span className="relative">
                      WhatsApp Us
                      <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#25D366] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </a>
                </li>
                <li className="pt-2 border-t border-white/10 mt-2">
                  <a 
                    href={siteConfig.address.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium tracking-widest text-white/40 hover:text-white transition-colors leading-relaxed block"
                  >
                    {siteConfig.address.full}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
            {siteConfig.footer.copyright}
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
            DESIGNED BY <span className="text-white hover:text-yellow-400 transition-colors cursor-crosshair">{siteConfig.fullName.toUpperCase()}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
