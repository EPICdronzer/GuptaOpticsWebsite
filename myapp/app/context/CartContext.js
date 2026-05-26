'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to get product image by ID (prevents heavy localStorage)
  const getProductImage = (id) => {
    const idStr = String(id).toLowerCase();
    if (idStr.includes('opulence') || idStr.includes('2')) return '/prod-2.png';
    if (idStr.includes('grandeur') || idStr.includes('3')) return '/prod-3.png';
    return '/prod-1.png';
  };

  // Load cart from localStorage once on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('Opticalgalaxy_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Re-attach images for UI display
        const withImages = parsed.map(item => ({
          ...item,
          image: getProductImage(item.id)
        }));
        setCartItems(withImages);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage (Lightweight - no images)
  useEffect(() => {
    if (isLoaded) {
      const lightweightCart = cartItems.map(({ image, ...rest }) => rest);
      localStorage.setItem('Opticalgalaxy_cart', JSON.stringify(lightweightCart));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.size === product.size &&
        JSON.stringify(item.prescription) === JSON.stringify(product.prescription)
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.color === product.color && item.size === product.size && JSON.stringify(item.prescription) === JSON.stringify(product.prescription))
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, color, size) => {
    setCartItems((prev) => prev.filter(item => !(item.id === id && item.color === color && item.size === size)));
  };

  const updateQuantity = (id, color, size, qty) => {
    if (qty < 1) return;
    setCartItems((prev) => prev.map(item => 
      (item.id === id && item.color === color && item.size === size)
        ? { ...item, quantity: qty }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      setIsCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
