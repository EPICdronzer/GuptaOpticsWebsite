'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../(users)/components/Navbar';
import Footer from '../../(users)/components/Footer';
import { useCart } from '../../context/CartContext';
import { useParams } from 'next/navigation';
import { getProductById } from '../../../actions/adminActions';

const ProductDetail = () => {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const fetched = await getProductById(productId);
        if (fetched) {
          setProduct(fetched);
          // Set default color/size if available, otherwise use defaults
          if (fetched.colors && fetched.colors.length > 0) {
            setSelectedColor(fetched.colors[0].toUpperCase());
          } else {
            setSelectedColor('BLACK');
          }
          if (fetched.sizes && fetched.sizes.length > 0) {
            setSelectedSize(fetched.sizes[0].toUpperCase());
          } else {
            setSelectedSize('MEDIUM');
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchDetail();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.name.toUpperCase(),
      price: `₹${product.price}`,
      image: (product.images && product.images[0]) || '/placeholder.png',
      color: selectedColor,
      size: selectedSize
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 md:pt-24 flex flex-col lg:flex-row min-h-[80vh] animate-pulse">
          <div className="w-full lg:w-1/2 bg-gray-50 aspect-square lg:aspect-auto lg:h-[80vh]"></div>
          <div className="w-full lg:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col gap-6 justify-center">
            <div className="h-10 bg-gray-100 w-3/4 rounded-sm"></div>
            <div className="h-6 bg-gray-100 w-1/3 rounded-sm"></div>
            <div className="h-20 bg-gray-100 w-full rounded-sm"></div>
            <div className="h-12 bg-gray-100 w-1/2 rounded-sm"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-48 px-6">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Product Not Found</h2>
          <p className="text-gray-400 text-sm mb-8">The product you are looking for does not exist or has been removed.</p>
          <a href="/shop" className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-colors">
            Return to Shop
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  // Default colors: Black, White. Default size: Medium
  const colorsList = product.colors && product.colors.length > 0 
    ? product.colors.map(c => c.toUpperCase()) 
    : ['BLACK', 'WHITE'];

  const sizesList = product.sizes && product.sizes.length > 0 
    ? product.sizes.map(s => s.toUpperCase()) 
    : ['MEDIUM'];

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/placeholder.png'];

  const activeImage = images[activeImageIndex] || images[0];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 md:pt-24">
        {/* Main Product Section */}
        <section className="flex flex-col lg:flex-row min-h-[80vh]">
          {/* Left: Product Images */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Main Image */}
            <div className="bg-[#F3F3F3] flex items-center justify-center p-8 md:p-16 overflow-hidden group flex-1 min-h-[50vh]">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-auto max-h-[60vh] object-contain transition-transform duration-1000 group-hover:scale-110 drop-shadow-2xl" 
              />
            </div>

            {/* Thumbnail Strip - only show if multiple images */}
            {images.length > 1 && (
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-3 overflow-x-auto scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-black shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 leading-none">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-xl md:text-2xl font-black text-black">₹{product.price}</span>
            </div>

            {product.description && (
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-10 max-w-md">
                {product.description}
              </p>
            )}

            {/* Category & Gender badges */}
            <div className="flex gap-2 mb-8">
              {product.category && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1.5 rounded-sm">
                  {product.category}
                </span>
              )}
              {product.gender && product.gender !== 'Unisex' && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1.5 rounded-sm">
                  {product.gender}
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Color</p>
              <div className="flex flex-wrap gap-3">
                {colorsList.map((color) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2.5 text-[10px] font-black border transition-all duration-300 rounded-sm ${
                      selectedColor === color ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-200 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Size</p>
              <div className="flex flex-wrap gap-3">
                {sizesList.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 text-[10px] font-black border transition-all duration-300 rounded-sm ${
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
              className="w-full bg-black text-white py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-500 shadow-xl rounded-sm"
            >
              ADD TO CART
            </button>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-[8px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Yellow Info Bar */}
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
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black">FREE SHIPPING</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetail;
