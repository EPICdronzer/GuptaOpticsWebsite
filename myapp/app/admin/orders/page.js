'use client';
import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../../actions/adminActions';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setOrders(await getOrders());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400"></div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    const nameMatch = order.customerName?.toLowerCase().includes(query);
    const phoneMatch = order.customerPhone?.toString().includes(query);
    const itemsMatch = order.items?.some(item => {
      return (
        item.name?.toLowerCase().includes(query) ||
        (item.color && item.color.toLowerCase().includes(query)) ||
        (item.size && item.size.toLowerCase().includes(query))
      );
    });
    return nameMatch || phoneMatch || itemsMatch;
  });

  return (
  <div className="flex flex-col gap-4 mb-4">
    <input
      type="text"
      placeholder="Search orders..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="bg-black/50 border border-white/10 p-3 text-xs sm:text-sm rounded-xl focus:border-yellow-400 outline-none w-full text-white transition-all"
    />
    <div className="grid gap-6">
      {filteredOrders.map((order) => (
        <div key={order._id} className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full">
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <h3 className="text-md sm:text-lg font-black uppercase tracking-widest">{order.customerName}</h3>
              {order.customerPhone && (
                <span className="text-xs bg-yellow-400/20 text-yellow-300 font-bold px-2 py-0.5 rounded tracking-wider">{order.customerPhone}</span>
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-0.5 rounded">ID: {order._id.slice(-6)}</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              {order.items.map((item, idx) => (
                <span key={idx} className="text-xs opacity-50 uppercase tracking-widest">
                  {item.name} {item.color && item.size ? `(${item.color}/${item.size})` : ''} x{item.quantity}
                </span>
              ))}
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 border-t border-white/5 md:border-0 pt-4 md:pt-0">
            <p className="text-yellow-400 font-black text-xl">₹{order.totalAmount}</p>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order._id, e.target.value).then(fetchData)}
              className="bg-black border border-white/10 p-2 text-xs font-black uppercase tracking-widest rounded outline-none"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-xs sm:text-sm uppercase tracking-widest opacity-40">
          No orders placed
        </div>
      )}
    </div>
  </div>
);


};

export default AdminOrdersPage;
