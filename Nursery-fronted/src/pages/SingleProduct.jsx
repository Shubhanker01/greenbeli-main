import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  ShieldCheck, 
  Sun, 
  Droplets, 
  ArrowLeft,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Award,
  Sparkles,
  HelpCircle,
  Share2
} from "lucide-react";
import { getProductBySlugOrId, getProducts, fetchApi, resolveImageUrl } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PlantCard from "../components/PlantCard";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const GREEN_DARK = "#163828";
const SAGE = "#cfe3c8";

export default function SingleProduct() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const productIdOrSlug = slug || id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [added, setAdded] = useState(false);

  // Reviews state
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getProductBySlugOrId(productIdOrSlug);
        setProduct(data);
        if (data?.images?.length > 0) {
          setSelectedImage(data.images[0]);
        } else if (data?.image) {
          setSelectedImage(data.image);
        } else {
          setSelectedImage("https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80");
        }

        setReviews(data?.reviews || []);

        const all = await getProducts();
        setRelatedProducts(all.filter((p) => p._id !== data?._id).slice(0, 4));
      } catch (error) {
        setLoadError(error.message || "Unable to load this product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [productIdOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="h-6 w-36 bg-emerald-100/60 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="aspect-[4/5] bg-emerald-100/60 rounded-md animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 w-28 bg-emerald-100/60 rounded animate-pulse" />
              <div className="h-12 w-3/4 bg-emerald-100/60 rounded animate-pulse" />
              <div className="h-6 w-40 bg-emerald-100/60 rounded animate-pulse" />
              <div className="h-24 w-full bg-emerald-100/60 rounded animate-pulse" />
              <div className="h-14 w-full bg-emerald-100/60 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream px-4">
        <div className="max-w-md w-full text-center space-y-5 py-16">
          <p style={{ color: GREEN }} className="text-xs font-bold uppercase tracking-[0.18em]">
            Botanical Catalog
          </p>
          <h2 role={loadError ? "alert" : undefined} className="serif-font text-3xl sm:text-4xl font-bold text-[#1f4a34]">
            {loadError || "Plant product not found"}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            The plant you are looking for may have bloomed out of stock or moved to a new botanical section.
          </p>
          <div>
            <Link
              to="/products"
              style={{ backgroundColor: GREEN }}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3.5 rounded-md shadow-md transition hover:brightness-90"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Plant Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await fetchApi(`/products/${product._id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      setReviews(prev => [{ reviewerName: user?.name || "Customer", rating: reviewRating, comment: reviewComment, createdAt: new Date() }, ...prev]);
      setReviewComment("");
    } catch {
      setReviews(prev => [{ reviewerName: user?.name || "Customer", rating: reviewRating, comment: reviewComment, createdAt: new Date() }, ...prev]);
      setReviewComment("");
    } finally {
      setSubmittingReview(false);
    }
  };

  const imagesList = product.images?.length > 0 
    ? product.images 
    : [selectedImage || product.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const categoryName = product.categoryId?.name || product.category || "Indoor Air Purifiers";

  return (
    <div className="bg-cream min-h-screen text-slate-800 pb-24 lg:pb-16">
      
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <Link to="/" className="hover:text-[#1f4a34] transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#1f4a34] transition">Shop Plants</Link>
          <span>/</span>
          <span className="text-[#1f4a34] font-semibold truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-16 sm:space-y-24">
        
        {/* Main Product Presentation (Consistent with Hero & Figma layout: No image card wrappers) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Left: Pure Minimalist Image Showcase (No card wrapper, clean soft borders, seamless blend) */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] sm:aspect-[8/9] overflow-hidden rounded-md bg-emerald-100/60">
              <img
                src={resolveImageUrl(selectedImage)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />

              {/* Status / Care tags (clean badges consistent with PlantCard) */}
              <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10 pointer-events-none">
                {product.careLevel && (
                  <span className="bg-white/95 text-[#1f4a34] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-sm">
                    {product.careLevel}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist round button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Add to wishlist"
                className={`absolute top-4 right-4 p-3 rounded-full transition z-10 shadow-sm ${
                  isLiked ? "bg-rose-500 text-white" : "bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Thumbnail selector without card container */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-emerald-100/50 transition-all shrink-0 ${
                      selectedImage === img 
                        ? "ring-2 ring-[#1f4a34] scale-102 opacity-100" 
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={resolveImageUrl(img)} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Typography, Botanical Details, Express Actions */}
          <div className="space-y-6 sm:space-y-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                  {categoryName}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-800">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : "Backorder Available"}
                </span>
              </div>

              <h1 
                style={{ color: GREEN }} 
                className="serif-font text-3xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.08] tracking-tight"
              >
                {product.name}
              </h1>

              {/* Rating & reviews header */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-0.5" role="img" aria-label="Rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ color: GREEN, fill: GREEN }} className="w-4 h-4 sm:w-5 sm:h-5" />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-800">{product.rating || 4.9}</span>
                <span className="text-xs sm:text-sm text-stone-500">
                  ({reviews.length || 38} customer reviews)
                </span>
              </div>
            </div>

            {/* Price display - Clean, elegant & consistent */}
            <div className="flex items-baseline gap-4 py-2 border-b border-stone-200/80">
              <span className="text-3xl sm:text-4xl font-bold text-[#1f4a34]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg sm:text-xl text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-sm">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Plant summary / description */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              {product.shortDescription || product.description || "Grown with care by senior horticulturists, packed in breathable eco-transit boxes and potted in nutrient-rich organic soil ready for your home."}
            </p>

            {/* Botanical Care Attributes: Sunlight & Watering */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div className="p-4 rounded-md bg-white/70 border border-stone-200/70 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Sunlight</p>
                  <p className="text-sm font-bold text-[#1f4a34]">{product.lightRequirement || "Bright Indirect Light"}</p>
                </div>
              </div>

              <div className="p-4 rounded-md bg-white/70 border border-stone-200/70 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Watering</p>
                  <p className="text-sm font-bold text-[#1f4a34]">{product.waterRequirement || "Once or twice a week"}</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-stone-700">Quantity</span>
                <div className="flex items-center gap-3 border border-stone-300 rounded-md px-3.5 py-2 bg-white/80">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="text-stone-500 hover:text-[#1f4a34] transition touch-active"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-stone-900 w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="text-stone-500 hover:text-[#1f4a34] transition touch-active"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Desktop Action Buttons */}
              <div className="hidden lg:grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added}
                  style={{ backgroundColor: GREEN }}
                  className="w-full text-white font-semibold py-4 px-6 rounded-md shadow-lg shadow-emerald-950/15 flex items-center justify-center gap-2.5 transition hover:brightness-90 touch-active text-base"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Add to Shopping Bag
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-[#163828] hover:bg-black text-white font-semibold py-4 px-6 rounded-md shadow-lg transition touch-active text-base"
                >
                  Buy Now Express
                </button>
              </div>
            </div>

            {/* Benefits Row (Consistent with Home Page Botanical Standard) */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-200/80 text-center">
              <div className="p-2 space-y-1">
                <Truck style={{ color: GREEN }} className="w-5 h-5 mx-auto" />
                <p className="text-xs font-bold text-[#1f4a34]">Transit Safe</p>
                <p className="text-[11px] text-stone-500">Eco-cushioned packaging</p>
              </div>
              <div className="p-2 space-y-1">
                <ShieldCheck style={{ color: GREEN }} className="w-5 h-5 mx-auto" />
                <p className="text-xs font-bold text-[#1f4a34]">7-Day Guarantee</p>
                <p className="text-[11px] text-stone-500">Free plant replacement</p>
              </div>
              <div className="p-2 space-y-1">
                <Award style={{ color: GREEN }} className="w-5 h-5 mx-auto" />
                <p className="text-xs font-bold text-[#1f4a34]">Organic Mix</p>
                <p className="text-[11px] text-stone-500">Pre-potted nutrition</p>
              </div>
            </div>

          </div>
        </div>

        {/* Botanical Care & Reviews Tab Section (Styled like Home FAQ / Highlights) */}
        <div className="border-t border-stone-200/80 pt-10 sm:pt-14 space-y-8">
          <div className="flex border-b border-stone-200 gap-6 sm:gap-10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("description")}
              style={activeTab === "description" ? { color: GREEN } : {}}
              className={`pb-4 text-base sm:text-lg font-bold transition whitespace-nowrap relative ${
                activeTab === "description" ? "text-[#1f4a34]" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Botanical Care & Specs
              {activeTab === "description" && (
                <span style={{ backgroundColor: GREEN }} className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              style={activeTab === "reviews" ? { color: GREEN } : {}}
              className={`pb-4 text-base sm:text-lg font-bold transition whitespace-nowrap relative ${
                activeTab === "reviews" ? "text-[#1f4a34]" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Customer Reviews ({reviews.length})
              {activeTab === "reviews" && (
                <span style={{ backgroundColor: GREEN }} className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-600 leading-relaxed text-sm sm:text-base">
              <div className="space-y-4">
                <h3 className="serif-font text-2xl font-bold text-[#1f4a34]">
                  Growing & Living with {product.name}
                </h3>
                <p>
                  {product.detailedDescription || product.description || "Every plant from GreenBeli is inspect-passed by senior botanists before dispatch. It comes pre-potted in lightweight, aeration-optimized organic coco peat mix with balanced vermicompost."}
                </p>
                <p>
                  Nurtured without synthetic retardants to ensure a natural transition into your indoor home or workplace sanctuary.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-md bg-white/70 border border-stone-200/70 space-y-1">
                  <h4 className="font-bold text-[#1f4a34] text-sm">🌿 Watering Advice</h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Water gently when top 1-2 inches of soil feel completely dry. Always ensure bottom drainage hole drains excess water.
                  </p>
                </div>

                <div className="p-5 rounded-md bg-white/70 border border-stone-200/70 space-y-1">
                  <h4 className="font-bold text-[#1f4a34] text-sm">☀️ Placement Guidelines</h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Thrives best in bright indirect ambient window light. Protect from direct harsh midday summer sun to keep leaf vibrant.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-3xl">
              <form onSubmit={handleReviewSubmit} className="p-6 rounded-md bg-white/80 border border-stone-200/80 space-y-4">
                <h4 className="serif-font text-xl font-bold text-[#1f4a34]">Leave a Review for {product.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Rating</span>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs font-semibold text-stone-800"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how your plant is thriving in your space..."
                  className="w-full bg-white border border-stone-300 rounded-md p-3 text-sm text-stone-800 focus:outline-none focus:border-[#1f4a34]"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{ backgroundColor: GREEN }}
                  className="text-white text-xs font-semibold px-6 py-2.5 rounded-md transition hover:brightness-90"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-stone-500 italic">No reviews yet. Be the first to share your plant parent experience!</p>
                ) : (
                  reviews.map((rev, idx) => (
                    <div key={idx} className="p-5 rounded-md bg-white/60 border border-stone-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#1f4a34]">{rev.reviewerName || rev.name || "Verified Plant Parent"}</span>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-stone-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* You Might Also Love (Minimal PlantCard variants identical to Home page) */}
        {relatedProducts.length > 0 && (
          <section className="space-y-8 pt-8 border-t border-stone-200/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                  Recommended For You
                </p>
                <h3 style={{ color: GREEN }} className="serif-font text-3xl sm:text-4xl font-bold mt-1">
                  You Might Also Love
                </h3>
              </div>
              <Link
                to="/products"
                style={{ color: GREEN, borderColor: GREEN }}
                className="inline-flex items-center gap-1 text-sm font-semibold border-b pb-0.5 hover:opacity-80 transition"
              >
                Explore all plants →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {relatedProducts.map((p) => (
                <PlantCard key={p._id} product={p} variant="minimal" />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Sticky Mobile Bottom Bar for Easy Ordering (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-cream/95 backdrop-blur-md border-t border-stone-200 z-40 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total</span>
          <p className="text-lg font-bold text-[#1f4a34]">₹{product.price * quantity}</p>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[260px]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={added}
            style={{ backgroundColor: GREEN }}
            className="flex-1 text-white font-semibold py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 shadow-md touch-active"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            <span>{added ? "Added" : "Add"}</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 bg-[#163828] text-white font-semibold py-2.5 rounded-md text-xs shadow-md touch-active text-center"
          >
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
}
