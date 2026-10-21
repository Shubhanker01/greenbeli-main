import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye, Check, Sun, Droplets } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function PlantCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const isLiked = isInWishlist(product._id);
  const imageUrl = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-100/80 shadow-xs sm:shadow-md hover:shadow-2xl plant-card-hover group flex flex-col justify-between relative touch-active h-full">

      {/* Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-square bg-emerald-50/50 overflow-hidden">
        <Link to={`/products/${product.slug || product._id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col items-start gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-amber-500 text-white text-[11px] sm:text-sm font-extrabold uppercase px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.careLevel && (
            <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-100 text-xs sm:text-sm font-semibold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full hidden sm:inline-block">
              {product.careLevel}
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs z-10 ${isLiked
            ? "bg-rose-500 text-white shadow-rose-500/40 scale-110"
            : "bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500"
            }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-white" : ""}`} />
        </button>

        {/* Quick View Link Overlay */}
        <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-3">
          <Link
            to={`/products/${product.slug || product._id}`}
            className="bg-white/90 text-emerald-950 p-3 rounded-full hover:bg-emerald-600 hover:text-white shadow-lg transition transform hover:scale-110"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-700 font-semibold mb-1 sm:mb-2">
            <span className="truncate max-w-[100px] sm:max-w-none">{product.category || "Indoor"}</span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug || product._id}`}>
            <h3 className="serif-font font-bold text-slate-900 text-base sm:text-2xl leading-snug min-h-[2.75rem] sm:min-h-[4rem] group-hover:text-emerald-700 transition line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Environmental Care Icons */}
          <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 my-3">
            {product.lightRequirement && (
              <span className="flex items-center gap-1">
                <Sun className="w-4 h-4 text-amber-500" /> {product.lightRequirement}
              </span>
            )}
            {product.waterRequirement && (
              <span className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-sky-500" /> {product.waterRequirement}
              </span>
            )}
          </div>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 sm:pt-4 border-t border-emerald-100 mt-3 sm:mt-4">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-slate-500 font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-3xl font-extrabold text-emerald-950">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-base text-slate-400 line-through hidden sm:inline">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`px-3.5 py-2 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition flex items-center gap-1.5 shadow-xs sm:shadow-md ${isAdded
              ? "bg-emerald-600 text-white"
              : "bg-emerald-900 hover:bg-emerald-800 text-white hover:shadow-emerald-900/20"
              }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}