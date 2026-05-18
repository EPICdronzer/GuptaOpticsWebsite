'use client';
import React, { useState } from 'react';
import { siteConfig } from '../../config';

const Footer = () => {
  const [message, setMessage] = useState('');

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || "Hi! I'm interested in Eyeconic sunglasses.");
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodedMessage}`, '_blank');
  };

  return (
    <footer className="w-full bg-[#111111] text-white pt-24 pb-12 px-12 md:px-32 lg:px-48">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          {/* Left Side: WhatsApp CTA & Logo */}
          <div className="flex flex-col gap-12 items-center lg:items-start text-center lg:text-left">
            <div>
              <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase">
                <span className="text-yellow-400">{siteConfig.name.substring(0, 2).toUpperCase()}</span>{siteConfig.name.substring(2).toUpperCase()}
              </span>
            </div>
            
            <div className="max-w-md flex flex-col gap-6 w-full">
              <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-white/90">
                WHATSAPP US TO GET 15% OFF YOUR FIRST PAIR
              </h4>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..." 
                  className="w-full bg-transparent border border-white/20 px-6 py-4 text-sm font-medium focus:outline-none focus:border-yellow-400 transition-colors text-center lg:text-left"
                />
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-white text-black py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Me
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 text-center lg:text-left">
            <div className="flex flex-col gap-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">MAIN PAGES</h5>
              <ul className="flex flex-col gap-4">
                {[
                  { name: 'Home', link: '/' },
                  { name: 'Shop', link: siteConfig.links.shop },
                  { name: 'About', link: siteConfig.links.about },
                  { name: 'Contact', link: siteConfig.links.contact },
                  { name: 'Terms & Conditions', link: '/terms' },
                  { name: 'Privacy Policy', link: '/privacy' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.link} className={`text-xs font-black uppercase tracking-widest transition-colors ${item.name === 'Home' ? 'text-yellow-400' : 'text-white/60 hover:text-white'}`}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">SOCIAL</h5>
              <ul className="flex flex-col gap-4">
                {Object.entries(siteConfig.social).map(([platform, url]) => (
                  <li key={platform}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">CONTACT</h5>
              <ul className="flex flex-col gap-4">
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-[#25D366] hover:text-white transition-colors">
                    WhatsApp us
                  </a>
                </li>
                <li>
                  <a 
                    href={siteConfig.address.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors leading-relaxed block"
                  >
                    {siteConfig.address.full}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            {siteConfig.footer.copyright}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            Created for <span className="text-white/60">{siteConfig.fullName}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
