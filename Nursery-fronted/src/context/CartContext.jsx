import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  addToCartApi,
  getUserCart,
  updateCartQuantityApi,
  removeFromCartApi,
  clearCartApi,
} from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const GUEST_CART_KEY = "nursery_guest_cart_items";
const PENDING_MERGE_KEY = "nursery_cart_merge_plan";

function readStoredArray(key) {
  try {
    const stored = localStorage.getItem(key);
    const value = stored ? JSON.parse(stored) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function mapServerCart(cart) {
  const lines = Array.isArray(cart?.Products) ? cart.Products : [];
  return lines.map((item) => {
    const product = typeof item.productId === "object" && item.productId !== null
      ? item.productId
      : (item.product || {});
    return {
      _id: String(product._id || item.productId || item._id),
      product,
      name: product.name || item.name || "Plant",
      price: product.price ?? item.price ?? 0,
      originalPrice: product.mrp || product.originalPrice || 0,
      image: product.images?.[0] || product.image?.[0] || product.image || item.image ||
        "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
      quantity: item.quantity || 1,
    };
  });
}

function createMergePlan(guestItems, serverCart, userId) {
  const serverQuantities = new Map(
    (serverCart?.Products || []).map((line) => [
      String(line.productId?._id || line.productId),
      Number(line.quantity) || 0,
    ])
  );
  const guestQuantities = new Map();

  for (const item of guestItems) {
    const productId = String(item._id || item.productId || item.product?._id || "");
    const quantity = Number(item.quantity);
    if (!/^[a-f\d]{24}$/i.test(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("A product in your saved cart is invalid. Remove it and try again.");
    }
    guestQuantities.set(productId, (guestQuantities.get(productId) || 0) + quantity);
  }

  return {
    userId,
    items: [...guestQuantities].map(([productId, guestQuantity]) => ({
      productId,
      quantity: (serverQuantities.get(productId) || 0) + guestQuantity,
    })),
  };
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [cartItems, setCartItems] = useState(() => readStoredArray(GUEST_CART_KEY));
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("nursery_wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSyncing, setCartSyncing] = useState(false);
  const [cartSyncError, setCartSyncError] = useState("");
  const [syncAttempt, setSyncAttempt] = useState(0);
  const wasAuthenticated = useRef(false);
  const clearGuestCartAfterLogout = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      if (wasAuthenticated.current) {
        wasAuthenticated.current = false;
        clearGuestCartAfterLogout.current = true;
        localStorage.removeItem(GUEST_CART_KEY);
        localStorage.removeItem(PENDING_MERGE_KEY);
        setCartItems([]);
        setCartSyncError("");
      }
      return;
    }

    wasAuthenticated.current = true;
    if (!user?.id) return;

    let active = true;
    const syncCart = async () => {
      setCartSyncing(true);
      setCartSyncError("");
      try {
        const storedPlan = JSON.parse(localStorage.getItem(PENDING_MERGE_KEY) || "null");
        let plan = storedPlan?.userId === user.id ? storedPlan : null;
        let serverCart;

        if (!plan) {
          if (storedPlan) localStorage.removeItem(PENDING_MERGE_KEY);
          serverCart = await getUserCart();
          const guestItems = readStoredArray(GUEST_CART_KEY);
          if (guestItems.length) {
            plan = createMergePlan(guestItems, serverCart, user.id);
            localStorage.setItem(PENDING_MERGE_KEY, JSON.stringify(plan));
          }
        }

        if (plan) {
          for (const item of plan.items) {
            await updateCartQuantityApi(item.productId, item.quantity);
          }
          serverCart = await getUserCart();
          localStorage.removeItem(GUEST_CART_KEY);
          localStorage.removeItem(PENDING_MERGE_KEY);
        }

        if (active) setCartItems(mapServerCart(serverCart));
      } catch (error) {
        if (active) {
          setCartSyncError(error.message || "Unable to sync your cart. Please try again.");
        }
      } finally {
        if (active) setCartSyncing(false);
      }
    };

    syncCart();
    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, user?.id, syncAttempt]);

  useEffect(() => {
    if (authLoading || isAuthenticated) return;
    if (clearGuestCartAfterLogout.current) {
      if (cartItems.length > 0) return;
      clearGuestCartAfterLogout.current = false;
      localStorage.removeItem(GUEST_CART_KEY);
      return;
    }
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  }, [authLoading, isAuthenticated, cartItems]);

  useEffect(() => {
    localStorage.setItem("nursery_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const retryCartSync = useCallback(() => {
    setSyncAttempt((attempt) => attempt + 1);
  }, []);

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
      return exists ? prev.filter((p) => p._id !== product._id) : [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some((product) => product._id === productId);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
        cartSyncing,
        cartSyncError,
        retryCartSync,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
