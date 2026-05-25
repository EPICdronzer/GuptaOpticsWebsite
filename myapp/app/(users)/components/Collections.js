'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProducts } from '../../../actions/adminActions';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const Collections = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const productsRef = useRef(null);

  // Fetch real products from DB
  useEffect(() => {
    getProducts().then((data) => {
      // Show up to 6 products
      setProducts(data.slice(0, 6));
    }).catch(console.error);
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading stagger
      gsap.fromTo(headingRef.current?.children ?? [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
      );
      // Products stagger
      gsap.fromTo(productsRef.current?.children ?? [],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: productsRef.current, start: 'top 80%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const features = [
    { name: 'CLARITY' },
    { name: 'CRAFTSMANSHIP' },
    { name: 'COMFORT' },
    { name: 'CONFIDENCE' },
  ];


  const [itemsToShow, setItemsToShow] = useState(3);
  const [gap, setGap] = useState(48);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(3);
        setGap(48);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(2);
        setGap(48);
      } else {
        setItemsToShow(1);
        setGap(32);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll on all viewports
  useEffect(() => {
    if (!mounted || products.length <= itemsToShow || isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, mounted, products.length, itemsToShow, isHovered]);

  const nextSlide = () => {
    setActiveIndex((prev) => {
      const maxIndex = Math.max(0, products.length - itemsToShow);
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setActiveIndex((prev) => {
      const maxIndex = Math.max(0, products.length - itemsToShow);
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
  };

  // Feature bar marquee
  const displayFeatures = [...features, ...features, ...features, ...features];

  return (
    <div id="next-section" ref={sectionRef} className="w-full bg-white">
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
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
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

        {/* Product Grid / Auto-Swiper */}
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={productsRef} 
            className="flex flex-nowrap gap-8 md:gap-12 transition-transform duration-700 ease-in-out"
            style={{ 
              transform: mounted ? `translateX(calc(-${activeIndex} * (100% + ${gap}px) / ${itemsToShow}))` : 'none' 
            }}
          >
            {products.length === 0 ? (
              <div className="w-full text-center py-16 text-gray-300 text-sm font-black uppercase tracking-widest">
                No collections available yet.
              </div>
            ) : (
              products.map((product) => (
                <div 
                  key={product._id || product.id} 
                  className="group cursor-pointer"
                  style={{
                    flex: '0 0 auto',
                    width: `calc((100% - ${(itemsToShow - 1) * gap}px) / ${itemsToShow})`
                  }}
                >
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden mb-6">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-xs uppercase font-black tracking-widest">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-end pb-4 border-b border-gray-100">
                    <h4 className="text-base md:text-lg font-black uppercase tracking-tight">{product.name}</h4>
                    <span className="text-gray-400 font-bold text-[10px] md:text-sm tracking-widest">₹{product.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Swiper Indicators / Dots */}
          {products.length > itemsToShow && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.max(1, products.length - itemsToShow + 1) }).map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === i ? 'bg-black w-4' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          )}
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
