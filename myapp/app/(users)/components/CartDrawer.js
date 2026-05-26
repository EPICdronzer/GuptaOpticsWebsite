'use client';
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../../actions/clientActions';
import { siteConfig } from '../../config';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    setErrorMsg('');
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter both name and number.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Save to Backend (Excluding image)
      const orderData = {
        name: customerName,
        phone: customerPhone,
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
      const itemsList = cartItems.map(item => {
        let text = `* ${item.name} (${item.color}/${item.size}) x${item.quantity} - ${item.price}`;
        if (item.prescription) {
          text += `\n  Prescription:`;
          text += `\n  RE(OD): SPH ${item.prescription.re.sph}, CYL ${item.prescription.re.cyl}, AXIS ${item.prescription.re.axis}, ADD ${item.prescription.re.add}`;
          text += `\n  LE(OS): SPH ${item.prescription.le.sph}, CYL ${item.prescription.le.cyl}, AXIS ${item.prescription.le.axis}, ADD ${item.prescription.le.add}`;
        }
        return text;
      }).join('\n');
      
      const message = `Hello Optical Galaxy! I would like to place an order:

*Customer Details:*
Name: ${customerName}
Phone: ${customerPhone}

*Order Details:*
${itemsList}

*Total Amount:* ₹${cartTotal.toFixed(2)}

Please confirm my order.`;

      // 3. Clear Cart & Reset Modal
      clearCart();
      setShowCheckoutModal(false);
      setIsCartOpen(false);
      setCustomerName('');
      setCustomerPhone('');

      // 4. Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('Failed to process checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={handleCheckoutClick}
            className="w-full bg-black text-white py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-300"
          >
            CONTINUE TO CHECKOUT
          </button>
        </div>

      </div>

      {/* Checkout Info Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 shadow-2xl rounded-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-black uppercase tracking-wider text-black mb-2">Checkout Details</h3>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">Please provide your details to finish your order via WhatsApp.</p>

            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ENTER YOUR NAME"
                  required
                  className="w-full border border-gray-200 p-3 rounded-lg focus:border-yellow-400 focus:outline-none uppercase text-xs font-black tracking-widest text-black"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Phone / WhatsApp Number</label>
                <input 
                  type="tel" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="ENTER PHONE NUMBER"
                  required
                  className="w-full border border-gray-200 p-3 rounded-lg focus:border-yellow-400 focus:outline-none text-xs font-black tracking-widest text-black"
                />
              </div>

              {errorMsg && (
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center mt-2">
                  {errorMsg}
                </p>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-colors mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER & CHAT'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
