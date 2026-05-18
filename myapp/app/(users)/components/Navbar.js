'use client';
import React, { useState, useEffect } from 'react';
import { siteConfig } from '../../config';
import { useCart } from '../../context/CartContext';

const Navbar = ({ isSolid = false, isWhiteOnLoad = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Shop', link: siteConfig.links.shop },
    { name: 'About', link: siteConfig.links.about },
    { name: 'Contact', link: siteConfig.links.contact }
  ];

  // Dynamic colors based on scroll/solid state
  const navBg = (isSolid || isScrolled) ? 'bg-black py-4 shadow-2xl' : 'bg-transparent py-6';
  
  // Logic for text color on load
  const isInitiallyWhite = isWhiteOnLoad && !isScrolled && !isSolid;
  const textColor = (isSolid || isScrolled) ? 'text-white' : (isWhiteOnLoad ? 'text-white' : 'text-black');
  const textMuted = (isSolid || isScrolled) ? 'text-white/70' : (isWhiteOnLoad ? 'text-white/70' : 'text-black/70');
  const iconColor = (isSolid || isScrolled) ? 'text-white' : (isWhiteOnLoad ? 'text-white' : 'text-black');

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${navBg}`}
    >
      <div className="w-full flex items-center justify-between px-12 md:px-32 lg:px-48">
        {/* Logo */}
        <div className="flex items-center">
          <span className={`text-xl md:text-2xl font-black tracking-tight uppercase transition-colors duration-500 ${textColor}`}>
            {siteConfig.name.toUpperCase()}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.link} 
              className={`text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-500 ${
                (isSolid || isScrolled) ? 'text-white/70 hover:text-white' : (isWhiteOnLoad ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black')
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right Side: Cart & Mobile Toggle */}
        <div className="flex items-center gap-4 md:gap-6">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer group"
          >
            <svg 
              className={`w-6 h-6 transition-all duration-500 group-hover:scale-110 ${iconColor}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className={`absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full transition-colors duration-500 ${(isSolid || isScrolled) ? 'bg-yellow-400 text-black' : (isWhiteOnLoad ? 'bg-yellow-400 text-black' : 'bg-black text-white')}`}>
              {cartCount}
            </span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={`lg:hidden p-1 transition-colors duration-500 ${iconColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-[400px] py-8 opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
      }`}>
        <nav className="flex flex-col items-center gap-6">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.link} 
              className="text-lg font-black text-white uppercase tracking-widest hover:text-yellow-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a href="#" className="text-lg font-black text-white uppercase tracking-widest hover:text-yellow-400 transition-colors">Pages</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
