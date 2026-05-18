'use client';
import React, { useState } from 'react';
import Navbar from '../../(users)/components/Navbar';
import Footer from '../../(users)/components/Footer';
import { useCart } from '../../context/CartContext';
import { useParams } from 'next/navigation';

const ProductDetail = () => {
  const params = useParams();
  const productId = params.id;
  const [selectedColor, setSelectedColor] = useState('ORANGE');
  const [selectedSize, setSelectedSize] = useState('SMALL');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: productId.replace(/-/g, ' ').toUpperCase(),
      price: '$ 119.00 USD',
      image: '/prod-1.png',
      color: selectedColor,
      size: selectedSize
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Product page usually has black text on load Navbar */}
      <Navbar />

      <div className="pt-20 md:pt-24">
        {/* Main Product Section */}
        <section className="flex flex-col lg:flex-row min-h-[80vh]">
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 bg-[#F3F3F3] flex items-center justify-center p-12 md:p-24 overflow-hidden group">
            <img 
              src="/prod-1.png" 
              alt="Velvet Motion" 
              className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-110 drop-shadow-2xl" 
            />
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
              {productId.replace(/-/g, ' ').toUpperCase()}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-xl md:text-2xl font-black text-black">$ 119.00 USD</span>
              <span className="text-base md:text-lg text-gray-400 line-through font-medium">$45.00</span>
            </div>

            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-12 max-w-md">
              The Urban Wayfarer is a modern take on a timeless classic. Crafted from premium acetate with polarized lenses, it offers unparalleled clarity and style for the modern explorer.
            </p>

            {/* Color Selector */}
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Color</p>
              <div className="flex gap-3">
                {['ORANGE', 'BLUE', 'PINK'].map((color) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 text-[10px] font-black border transition-all duration-300 ${
                      selectedColor === color ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-200 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-12">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Size</p>
              <div className="flex gap-3">
                {['SMALL', 'MEDIUM', 'LARGE'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 text-[10px] font-black border transition-all duration-300 ${
                      selectedSize === size ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-6 text-sm font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-500 shadow-xl"
            >
              ADD TO CART
            </button>
          </div>
        </section>

        {/* Yellow Info Bar - Icons Removed */}
        <div className="bg-yellow-400 py-6 border-y border-black/10">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 px-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">500,000+ 5 STAR REVIEWS</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-black/20"></div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">1-YEAR LIMITED WARRANTY</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-black/20"></div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">FREE US SHIPPING</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetail;
