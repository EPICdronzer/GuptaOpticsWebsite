'use client';
import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, getAppointments, updateAppointmentStatus, getOrders, updateOrderStatus } from '../../actions/adminActions';
import { siteConfig } from '../config';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'products') setProducts(await getProducts());
    if (activeTab === 'appointments') setAppointments(await getAppointments());
    if (activeTab === 'orders') setOrders(await getOrders());
    setLoading(false);
  };

  const handleUploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', siteConfig.backend.cloudinary.uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${siteConfig.backend.cloudinary.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      setUploading(false);
      return null;
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = e.target.imageFile.files[0];
    
    if (imageFile) {
      const imageUrl = await handleUploadToCloudinary(imageFile);
      if (imageUrl) {
        formData.append('images', imageUrl);
        await addProduct(formData);
        e.target.reset();
        fetchData();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-xs uppercase tracking-widest text-white/40 mt-1">Management Dashboard • {siteConfig.name}</p>
          </div>
          
          <nav className="flex gap-8">
            {['products', 'appointments', 'orders'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400 pb-2' : 'opacity-40 hover:opacity-100'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400"></div>
          </div>
        ) : (
          <main>
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Add Product Form */}
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-fit">
                  <h2 className="text-lg font-black uppercase tracking-widest mb-8 text-yellow-400">Add New Product</h2>
                  <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                    <input name="name" placeholder="PRODUCT NAME" required className="bg-black border border-white/10 p-3 text-[10px] font-black uppercase tracking-widest rounded-lg focus:border-yellow-400 outline-none" />
                    <input name="price" type="number" placeholder="PRICE" required className="bg-black border border-white/10 p-3 text-[10px] font-black uppercase tracking-widest rounded-lg focus:border-yellow-400 outline-none" />
                    <select name="category" className="bg-black border border-white/10 p-3 text-[10px] font-black uppercase tracking-widest rounded-lg focus:border-yellow-400 outline-none">
                      <option value="Velvet">Velvet</option>
                      <option value="Urban">Urban</option>
                      <option value="Modern">Modern</option>
                      <option value="Retro">Retro</option>
                    </select>
                    <textarea name="description" placeholder="DESCRIPTION" className="bg-black border border-white/10 p-3 text-[10px] font-black uppercase tracking-widest rounded-lg focus:border-yellow-400 outline-none h-24" />
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black opacity-40">Product Image (Uploads to Cloudinary)</label>
                      <input name="imageFile" type="file" className="text-[10px]" />
                    </div>
                    <button 
                      type="submit" 
                      disabled={uploading}
                      className="bg-yellow-400 text-black p-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mt-4 disabled:opacity-50"
                    >
                      {uploading ? 'UPLOADING...' : 'SAVE PRODUCT'}
                    </button>
                  </form>
                </div>

                {/* Product List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-6 relative group">
                      <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">{product.name}</h3>
                        <p className="text-yellow-400 font-black text-xs mt-1">₹{product.price}</p>
                        <p className="text-[9px] uppercase tracking-widest opacity-40 mt-2">{product.category}</p>
                        <button 
                          onClick={() => deleteProduct(product._id).then(fetchData)}
                          className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-60">Customer</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-60">Date</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-60">Status</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-60">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-6 font-black uppercase text-xs">{apt.name}</td>
                        <td className="p-6 text-xs opacity-60">{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="p-6">
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-6 flex gap-4">
                          <button onClick={() => updateAppointmentStatus(apt._id, 'confirmed').then(fetchData)} className="text-[10px] font-black text-green-500 uppercase tracking-widest hover:underline">Confirm</button>
                          <button onClick={() => updateAppointmentStatus(apt._id, 'cancelled').then(fetchData)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white/5 p-8 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-sm font-black uppercase tracking-widest">{order.customerName}</h3>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-0.5 rounded">ID: {order._id.slice(-6)}</span>
                      </div>
                      <div className="flex gap-4">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-[10px] opacity-40 uppercase tracking-widest">{item.name} (x{item.quantity})</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-black text-lg">₹{order.totalAmount}</p>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value).then(fetchData)}
                        className="bg-black border border-white/10 p-2 text-[10px] font-black uppercase tracking-widest rounded mt-2 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
