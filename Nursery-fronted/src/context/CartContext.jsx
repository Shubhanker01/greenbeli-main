import React, { createContext, useContext, useState, useEffect } from "react";
import { addToCartApi, getUserCart, updateCartQuantityApi, removeFromCartApi, clearCartApi } from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("nursery_cart_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("nursery_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart from backend when logged in
  useEffect(() => {
    if (isAuthenticated) {
      getUserCart()
        .then((res) => {
          if (res && Array.isArray(res.items)) {
            const formatted = res.items.map(item => ({
              _id: item.product?._id || item.productId,
              product: item.product || {},
              name: item.product?.name || item.name || "Plant",
              price: item.product?.price || item.price || 499,
              image: item.product?.images?.[0] || item.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
              quantity: item.quantity || 1,
            }));
            setCartItems(formatted);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Persist cart to local storage
  useEffect(() => {
    localStorage.setItem("nursery_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem("nursery_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          product,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || product.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
          quantity,
        },
      ];
    });

    if (isAuthenticated) {
      addToCartApi(product._id, quantity).catch(() => {});
    }

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity } : item))
    );

    if (isAuthenticated) {
      updateCartQuantityApi(productId, quantity).catch(() => {});
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    if (isAuthenticated) {
      removeFromCartApi(productId).catch(() => {});
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (isAuthenticated) {
      clearCartApi().catch(() => {});
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p._id === productId);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
