'use client';
import React, { useState } from 'react';
import Navbar from '../(users)/components/Navbar';
import Footer from '../(users)/components/Footer';

const ShopPage = () => {
  const [filter, setFilter] = useState('ALL');

  const products = [
    { id: 1, name: 'VELVET MOTION', price: '$119.00', category: 'MAN', image: '/prod-1.png' },
    { id: 2, name: 'URBAN OPULENCE', price: '$99.00', category: 'WOMAN', image: '/prod-2.png' },
    { id: 3, name: 'MODERN GRANDEUR', price: '$159.00', category: 'MAN', image: '/prod-3.png' },
    { id: 4, name: 'RETRO ROUND', price: '$109.00', category: 'KIDS', image: '/prod-1.png' },
    { id: 5, name: 'CHROME LUXURY', price: '$59.00', category: 'ACCESSORIES', image: '/prod-2.png' },
    { id: 6, name: 'NOIR AESTHETIC', price: '$129.00', category: 'WOMAN', image: '/prod-3.png' },
    { id: 7, name: 'CRYSTAL CLEAR', price: '$139.00', category: 'MAN', image: '/prod-1.png' },
    { id: 8, name: 'AMBER GLOW', price: '$89.00', category: 'WOMAN', image: '/prod-2.png' },
    { id: 9, name: 'TECH TITAN', price: '$179.00', category: 'ACCESSORIES', image: '/prod-3.png' },
  ];

  const filteredProducts = filter === 'ALL' 
    ? products 
    : products.filter(p => p.category === filter);

  const categories = ['ALL', 'MAN', 'WOMAN', 'KIDS', 'ACCESSORIES'];

  return (
    <main className="min-h-screen bg-white">
      <Navbar isWhiteOnLoad={true} />
      
      {/* Shop Hero */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="Shop Hero" className="w-full h-full object-cover blur-[2px] scale-105" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        </div>
        <h1 className="relative z-10 text-5xl md:text-8xl font-black text-white uppercase tracking-tighter text-center">
          OUR <span className="text-yellow-400">SHOP</span>
        </h1>
      </section>

      {/* Filter & Products Section */}
      <section className="px-12 md:px-32 lg:px-48 py-16 md:py-24 max-w-[1400px] mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 md:mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest border transition-all duration-300 rounded-sm ${
                filter === cat 
                  ? 'bg-black text-white border-black' 
                  : 'bg-transparent text-black border-gray-200 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-16 md:gap-y-24">
          {filteredProducts.map((product) => (
            <a key={product.id} href={`/shop/${product.id}`} className="group cursor-pointer">
              <div className="relative aspect-square bg-gray-50 overflow-hidden mb-8 rounded-sm">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {product.category}
                </div>
              </div>
              <div className="flex justify-between items-end pb-4 border-b border-gray-100">
                <div>
                  <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-1">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{product.category}</p>
                </div>
                <span className="text-black font-black text-sm md:text-base tracking-tighter">{product.price}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-gray-400 font-black uppercase tracking-widest">No products found in this category.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default ShopPage;
