'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../(users)/components/Navbar';
import Footer from '../(users)/components/Footer';
import { getProducts } from '../../actions/adminActions';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const searchParams = useSearchParams();

  // Read gender and tag query params on mount
  useEffect(() => {
    const genderParam = searchParams.get('gender');
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setFilter('TAG:' + tagParam.toLowerCase());
    } else if (genderParam) {
      setFilter(genderParam.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const fetched = await getProducts();
        setProducts(fetched);
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filter === 'ALL') return true;

    // Tag-based filter (e.g. TAG:new)
    if (filter.startsWith('TAG:')) {
      const tagTarget = filter.replace('TAG:', '');
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some((t) => t.toLowerCase() === tagTarget);
    }

    const productGender = product.gender ? product.gender.toUpperCase() : '';
    const productCategory = product.category ? product.category.toUpperCase() : '';

    if (filter === 'MAN') {
      return productGender === 'MEN' || productGender === 'UNISEX';
    }
    if (filter === 'WOMAN') {
      return productGender === 'WOMEN' || productGender === 'UNISEX';
    }
    if (filter === 'KIDS') {
      return productGender === 'KIDS';
    }

    return productCategory === filter;
  });

  const categories = ['ALL', 'MAN', 'WOMAN', 'KIDS', 'VELVET', 'URBAN', 'MODERN', 'RETRO'];

  if (loading) {
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

        {/* Shimmer Loader */}
        <section className="px-12 md:px-32 lg:px-48 py-16 md:py-24 max-w-[1400px] mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-16 md:mb-20">
            {categories.map((cat) => (
              <div key={cat} className="h-10 w-24 bg-gray-100 rounded-sm animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-16 md:gap-y-24">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="aspect-square bg-gray-100 rounded-sm"></div>
                <div className="h-5 bg-gray-100 w-2/3 rounded-sm"></div>
                <div className="h-4 bg-gray-100 w-1/3 rounded-sm"></div>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    );
  }

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
          {filteredProducts.map((product) => {
            const activeImage = (product.images && product.images[0]) || '/placeholder.png';
            const displayGender = product.gender ? (product.gender === 'Men' ? 'MAN' : product.gender === 'Women' ? 'WOMAN' : product.gender === 'Kids' ? 'KIDS' : 'UNISEX') : 'UNISEX';
            const subtext = product.category ? `${product.category.toUpperCase()} • ${displayGender}` : displayGender;

            return (
              <a key={product._id} href={`/shop/${product._id}`} className="group cursor-pointer">
                <div className="relative aspect-square bg-gray-50 overflow-hidden mb-8 rounded-sm">
                  <img 
                    src={activeImage} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {product.category || 'NEW'}
                  </div>
                </div>
                <div className="flex justify-between items-end pb-4 border-b border-gray-100">
                  <div>
                    <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-1">{product.name}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{subtext}</p>
                  </div>
                  <span className="text-black font-black text-sm md:text-base tracking-tighter">₹{product.price}</span>
                </div>
              </a>
            );
          })}
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
