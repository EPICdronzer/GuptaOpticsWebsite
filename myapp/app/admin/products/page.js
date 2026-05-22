'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../../../actions/adminActions';
import { siteConfig } from '../../config';
import Toast from '../components/Toast';
import StyledSelect from '../components/StyledSelect';
import ConfirmModal from '../components/ConfirmModal';

const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression failed'));
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Edit mode & custom input states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Velvet');
  const [gender, setGender] = useState('Unisex');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  
  // Image selection states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  // Search, Filter and Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  
  // Temporary active image states for product card hover previews
  const [hoveredProductImage, setHoveredProductImage] = useState({});

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null, productName: '' });
  const [showMobileForm, setShowMobileForm] = useState(false);

  const fileInputRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setProducts(await getProducts());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill form when editing a product
  const startEdit = (product) => {
    setEditingId(product._id);
    setName(product.name || '');
    setPrice(product.price || '');
    setCategory(product.category || 'Velvet');
    setGender(product.gender || 'Unisex');
    setTags(product.tags ? product.tags.join(', ') : '');
    setDescription(product.description || '');
    setColors(product.colors ? product.colors.join(', ') : '');
    setSizes(product.sizes ? product.sizes.join(', ') : '');
    setExistingImages(product.images || []);
    setSelectedFiles([]);
    setErrorMsg('');
    setShowMobileForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setCategory('Velvet');
    setGender('Unisex');
    setTags('');
    setDescription('');
    setColors('');
    setSizes('');
    setExistingImages([]);
    setSelectedFiles([]);
    setErrorMsg('');
    setShowMobileForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      showToast('Processing and compressing images...', 'info');
      try {
        const compressedPromises = filesArray.map(file => {
          if (file.type.startsWith('image/')) {
            return compressImage(file);
          }
          return Promise.resolve(file);
        });
        const compressedFiles = await Promise.all(compressedPromises);
        setSelectedFiles((prev) => [...prev, ...compressedFiles]);
        showToast('Images ready for upload!', 'success');
      } catch (err) {
        console.error('Image compression error:', err);
        showToast('Failed to compress some images, using originals.', 'warning');
        setSelectedFiles((prev) => [...prev, ...filesArray]);
      }
    }
  };

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeExistingImage = (urlToRemove) => {
    setExistingImages((prev) => prev.filter((img) => img !== urlToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setUploading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('gender', gender);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('sizes', sizes);

    // Append newly selected files
    selectedFiles.forEach((file) => {
      formData.append('imageFiles', file);
    });

    // Append remaining existing images
    existingImages.forEach((imgUrl) => {
      formData.append('existingImages', imgUrl);
    });

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        showToast('Product updated successfully!', 'success');
      } else {
        await addProduct(formData);
        showToast('Product added successfully!', 'success');
      }
      
      // Reset form
      cancelEdit();
      setShowMobileForm(false);
      fetchData();
    } catch (err) {
      console.error('Save Product Error:', err);
      const msg = err.message || 'Failed to save product details.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  // Filtered Products list
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Mobile Form Overlay */}
      {showMobileForm && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black uppercase tracking-widest text-yellow-400">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button type="button" onClick={() => { cancelEdit(); setShowMobileForm(false); }} className="text-white/60 hover:text-white p-2 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

<form onSubmit={handleSubmit} className="flex flex-col gap-5">
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Product Name</label>
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
      required 
      className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
    />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price (₹)</label>
    <input 
      value={price}
      onChange={(e) => {
        const val = parseFloat(e.target.value);
        setPrice(val < 0 ? 0 : e.target.value);
      }}
      type="number" 
      min="0"
      placeholder="PRICE IN INR" 
      required 
      className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
    />
  </div>

  <div className="flex gap-4">
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</label>
      <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-black border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 outline-none w-full text-white cursor-pointer"
      >
        <option value="Velvet">Velvet</option>
        <option value="Urban">Urban</option>
        <option value="Modern">Modern</option>
        <option value="Retro">Retro</option>
      </select>
    </div>

    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Target Audience</label>
      <select 
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="bg-black border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 outline-none w-full text-white cursor-pointer"
      >
        <option value="Unisex">Unisex</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>
    </div>
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tags</label>
    <input 
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      placeholder="E.G. SUMMER, TRENDING, GLASSES" 
      className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
    />
    <span className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Comma separated</span>
  </div>

  <div className="flex gap-4">
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Colors</label>
      <input 
        value={colors}
        onChange={(e) => setColors(e.target.value)}
        placeholder="E.G. BLACK, GOLD, SILVER" 
        className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
      />
      <span className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Comma separated</span>
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Sizes</label>
      <input 
        value={sizes}
        onChange={(e) => setSizes(e.target.value)}
        placeholder="E.G. SMALL, MEDIUM, LARGE" 
        className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
      />
      <span className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Comma separated</span>
    </div>
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
    <textarea 
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="DETAILED DESCRIPTION OF THE MATERIAL, FIT, OR STYLE..." 
      className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none h-24 w-full transition-all text-white resize-none" 
    />
  </div>

  {/* Dynamic Image Preview & Input Section */}
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
      Product Images
    </label>

    {/* Drag and Drop Dropzone */}
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-white/10 hover:border-yellow-400/50 bg-black/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
    >
      <input 
        type="file" 
        multiple 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/*"
      />
      <svg className="w-8 h-8 mx-auto text-white/30 group-hover:text-yellow-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors block">Select Multiple Images</span>
      <span className="text-[9px] uppercase tracking-widest text-white/30 block mt-1">Supports multiple uploads at once</span>
    </div>

    {/* Live Preview Grid */}
    {(existingImages.length > 0 || selectedFiles.length > 0) && (
      <div className="grid grid-cols-3 gap-3 bg-black/40 border border-white/5 p-3 rounded-2xl max-h-56 overflow-y-auto mt-2">
        {/* Render existing Cloudinary images */}
        {existingImages.map((imgUrl, idx) => (
          <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-cyan-500/20 group">
            <img src={imgUrl} alt={`Existing preview ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeExistingImage(imgUrl)}
                className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-500 transform hover:scale-110 transition-all cursor-pointer"
                title="Remove Image"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <span className="absolute top-1 left-1 bg-cyan-950/80 border border-cyan-500 text-cyan-400 font-extrabold text-[8px] tracking-wider px-1 rounded uppercase">Cloud</span>
          </div>
        ))}

        {/* Render newly selected files */}
        {selectedFiles.map((file, idx) => {
          const localUrl = URL.createObjectURL(file);
          return (
            <div key={`selected-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-yellow-500/20 group">
              <img src={localUrl} alt={`New preview ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeSelectedFile(idx)}
                  className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-500 transform hover:scale-110 transition-all cursor-pointer"
                  title="Remove Image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <span className="absolute top-1 left-1 bg-yellow-950/80 border border-yellow-500 text-yellow-400 font-extrabold text-[8px] tracking-wider px-1 rounded uppercase">New</span>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {errorMsg && (
    <div className="text-red-500 text-xs font-black uppercase tracking-widest text-center mt-2 border border-red-500/20 bg-red-500/5 p-3 rounded-xl">
      {errorMsg}
    </div>
  )}

  <button 
    type="submit" 
    disabled={uploading || (editingId === null && selectedFiles.length === 0 && existingImages.length === 0)}
    className="bg-yellow-400 text-black p-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-[0.2em] mt-2 disabled:opacity-40 hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all cursor-pointer"
  >
    {uploading ? 'PROCESSING...' : editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
  </button>
</form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Glassmorphic Form Column - hidden on mobile, shown on desktop */}
        <div className={`bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl sticky top-24 ${showMobileForm ? '' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black uppercase tracking-widest text-yellow-400">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Product Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price (₹)</label>
              <input 
                value={price}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setPrice(val < 0 ? 0 : e.target.value);
                }}
                type="number" 
                min="0"
                placeholder="PRICE IN INR" 
                required 
                className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</label>
              <StyledSelect
                options={[
                  { value: 'Velvet', label: 'Velvet' },
                  { value: 'Urban', label: 'Urban' },
                  { value: 'Modern', label: 'Modern' },
                  { value: 'Retro', label: 'Retro' }
                ]}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select Category"
                className="flex-1"
              />
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Target Audience</label>
                <StyledSelect 
                  options={[
                    { value: 'Unisex', label: 'Unisex' },
                    { value: 'Men', label: 'Men' },
                    { value: 'Women', label: 'Women' },
                    { value: 'Kids', label: 'Kids' }
                  ]}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Select Audience"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tags</label>
              <input 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="E.G. SUMMER, TRENDING, GLASSES" 
                className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
              />
              <span className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Comma separated</span>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Colors</label>
                <input 
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="E.G. BLACK, GOLD" 
                  className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
                />
                <span className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Comma separated</span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Sizes</label>
                <input 
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="E.G. S, M, L, XL" 
                  className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none w-full transition-all text-white" 
                />
                <span className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Comma separated</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="DETAILED DESCRIPTION OF THE MATERIAL, FIT, OR STYLE..." 
                className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm font-medium uppercase tracking-widest rounded-xl focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)] outline-none h-24 w-full transition-all text-white resize-none" 
              />
            </div>

            {/* Dynamic Image Preview & Input Section */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Product Images
              </label>

              {/* Drag and Drop Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-yellow-400/50 bg-black/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
              >
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="image/*"
                />
                <svg className="w-8 h-8 mx-auto text-white/30 group-hover:text-yellow-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors block">
                  Select Multiple Images
                </span>
                <span className="text-[9px] uppercase tracking-widest text-white/30 block mt-1">
                  Supports multiple uploads at once
                </span>
              </div>

              {/* Live Preview Grid */}
              {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div className="grid grid-cols-3 gap-3 bg-black/40 border border-white/5 p-3 rounded-2xl max-h-56 overflow-y-auto mt-2">
                  {/* Render existing Cloudinary images */}
                  {existingImages.map((imgUrl, idx) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-cyan-500/20 group">
                      <img src={imgUrl} alt={`Existing preview ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imgUrl)}
                          className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-500 transform hover:scale-110 transition-all cursor-pointer"
                          title="Remove Image"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <span className="absolute top-1 left-1 bg-cyan-950/80 border border-cyan-500 text-cyan-400 font-extrabold text-[8px] tracking-wider px-1 rounded uppercase">
                        Cloud
                      </span>
                    </div>
                  ))}

                  {/* Render newly selected files */}
                  {selectedFiles.map((file, idx) => {
                    const localUrl = URL.createObjectURL(file);
                    return (
                      <div key={`selected-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-yellow-500/20 group">
                        <img src={localUrl} alt={`New preview ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-500 transform hover:scale-110 transition-all cursor-pointer"
                            title="Remove Image"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <span className="absolute top-1 left-1 bg-yellow-950/80 border border-yellow-500 text-yellow-400 font-extrabold text-[8px] tracking-wider px-1 rounded uppercase">
                          New
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {errorMsg && (
              <div className="text-red-500 text-xs font-black uppercase tracking-widest text-center mt-2 border border-red-500/20 bg-red-500/5 p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || (editingId === null && selectedFiles.length === 0 && existingImages.length === 0)}
              className="bg-yellow-400 text-black p-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-[0.2em] mt-2 disabled:opacity-40 hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all cursor-pointer"
            >
              {uploading ? 'PROCESSING...' : editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
            </button>
          </form>
        </div>

        {/* Product Grid & Filtering Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Filtering & Search Header Card */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            <div className="relative w-full md:max-w-xs">
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PRODUCTS..." 
                className="bg-black/50 border border-white/10 p-3 pl-9 text-xs font-semibold uppercase tracking-widest rounded-xl focus:border-yellow-400 outline-none w-full text-white" 
              />
              <svg className="w-4 h-4 text-white/30 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {['All', 'Velvet', 'Urban', 'Modern', 'Retro'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
                    filterCategory === cat 
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.25)]' 
                      : 'bg-black/30 text-white/60 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex flex-col gap-4">
            {currentProducts.map((product) => {
              const activeImage = hoveredProductImage[product._id] || (product.images && product.images[0]) || '/placeholder.png';
              return (
                <div 
                  key={product._id} 
                  className="bg-[#0a0a0a] p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(250,204,21,0.06)] transition-all duration-300 flex flex-row gap-4 relative group"
                >
                  {/* Product Image - rectangular thumbnail on left */}
                  <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={activeImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs uppercase">
                        No Collection
                      </div>
                    )}
                    <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-yellow-400 text-black text-[8px] sm:text-[10px] font-black tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase shadow-lg shadow-black/50">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Product Info - right side */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white group-hover:text-yellow-400 transition-colors truncate">
                          {product.name}
                        </h3>
                        <span className="text-[8px] sm:text-[9px] bg-white/5 border border-white/10 text-white/50 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 hidden sm:inline">
                          {product.category}{product.gender !== 'Unisex' ? ` • ${product.gender}` : ''}
                        </span>
                      </div>
                      {product.description && (
                        <p className="text-[10px] sm:text-xs text-white/40 tracking-wide line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 hidden sm:flex">
                          {product.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[7px] sm:text-[8px] bg-white/5 border border-white/10 text-white/50 px-1.5 py-0.5 rounded uppercase tracking-wider">{tag}</span>
                          ))}
                          {product.tags.length > 3 && <span className="text-[7px] text-white/30 px-1 uppercase">+{product.tags.length - 3}</span>}
                        </div>
                      )}
                    </div>

                    {/* Actions row */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, productId: product._id, productName: product.name })}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-white/10 rounded-3xl p-16 text-center text-xs sm:text-sm uppercase tracking-widest text-white/40">
                No matching products found
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-xs font-black uppercase tracking-widest text-white/60">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB - Add Product */}
      {!showMobileForm && (
        <button
          onClick={() => { cancelEdit(); setShowMobileForm(true); }}
          className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Product"
        message={`This will permanently delete "${confirmModal.productName}" and all its images from Cloudinary. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep It"
        variant="danger"
        onConfirm={async () => {
          setConfirmModal({ isOpen: false, productId: null, productName: '' });
          try {
            await deleteProduct(confirmModal.productId);
            showToast(`"${confirmModal.productName}" deleted successfully.`, 'success');
            fetchData();
          } catch (err) {
            showToast(err.message || 'Failed to delete product.', 'error');
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, productId: null, productName: '' })}
      />
    </div>
  );
};

export default AdminProductsPage;
