'use client';
import React from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../../actions/clientActions';
import { siteConfig } from '../../config';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // 1. Save to Backend
    const orderData = {
      name: "Customer", // You could add a name input field in the drawer
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
        quantity: item.quantity,
        color: item.color,
        size: item.size
      })),
      totalAmount: cartTotal
    };

    await createOrder(orderData);

    // 2. Prepare WhatsApp Message
    const itemsList = cartItems.map(item => `- ${item.name} (${item.color}/${item.size}) x${item.quantity}`).join('\n');
    const message = `Hello Optical Galaxy! I would like to place an order:
    
Order Details:
${itemsList}

Total Amount: ₹${cartTotal.toFixed(2)}

Please confirm my order.`;

    const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[200] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[90%] md:w-[450px] bg-white z-[201] transition-transform duration-700 ease-out shadow-2xl flex flex-col ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-widest">YOUR CART</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Your cart is empty</p>
              <a href="/shop" onClick={() => setIsCartOpen(false)} className="text-xs font-black uppercase underline tracking-widest">Start Shopping</a>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-6 group">
                <div className="w-24 h-24 bg-gray-50 overflow-hidden rounded-sm flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-black uppercase tracking-tight">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id, item.color, item.size)}
                        className="text-gray-300 hover:text-black transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm font-black text-black mb-2">{item.price}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Color: {item.color}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Size: {item.size}</p>
                  </div>
                  <div className="flex items-center border border-gray-100 w-fit mt-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, item.color, item.size, parseInt(e.target.value) || 1)}
                      className="w-10 text-center text-xs font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button 
                      onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">SUBTOTAL</span>
            <span className="text-xl font-black">₹ {cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full bg-black text-white py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-300"
          >
            CONTINUE TO CHECKOUT
          </button>
        </div>

      </div>
    </>
  );
};

export default CartDrawer;
