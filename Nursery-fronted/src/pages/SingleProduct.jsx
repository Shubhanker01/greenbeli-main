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
  Sparkles, 
  ArrowLeft,
  Truck,
  RotateCcw,
  Plus,
  Minus
} from "lucide-react";
import { getProductBySlugOrId, getProducts, fetchApi } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PlantCard from "../components/PlantCard";

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
      setLoading(false);
    }
    loadProductData();
  }, [productIdOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-slate-100 rounded-3xl h-[400px] sm:h-[500px] animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <h2 className="serif-font text-2xl font-bold text-slate-800">Plant product not found</h2>
        <Link to="/products" className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold inline-block">
          Return to Shop
        </Link>
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
    } catch (err) {
      setReviews(prev => [{ reviewerName: user?.name || "Customer", rating: reviewRating, comment: reviewComment, createdAt: new Date() }, ...prev]);
      setReviewComment("");
    } finally {
      setSubmittingReview(false);
    }
  };

  const imagesList = product.images?.length > 0 ? product.images : [selectedImage];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-24 lg:pb-12">
      
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Plants Catalog
      </Link>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start">
        
        {/* Left Image Gallery */}
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-square bg-emerald-50 rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-100/80 relative shadow-md sm:shadow-xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.careLevel && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-emerald-950/80 text-emerald-200 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md">
                {product.careLevel}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-full backdrop-blur-md transition shadow-md ${
                isLiked ? "bg-rose-500 text-white" : "bg-white/80 text-slate-700 hover:bg-white"
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === img ? "border-emerald-600 scale-105" : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="space-y-4 sm:space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
              <span>{product.category || "Indoor Plants"}</span>
              <span>•</span>
              <span className="text-emerald-800">In Stock ({product.stock || 20} left)</span>
            </div>

            <h1 className="serif-font text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating || 4.9}</span>
              <span className="text-xs text-slate-400">({reviews.length || 38} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm sm:text-base text-slate-400 line-through">₹{product.originalPrice}</span>
                <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description || "Fresh botanical nursery plant carefully packaged with soil mix and nursery pot ready for display."}
          </p>

          {/* Environmental Attributes */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white border border-emerald-100 flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Sunlight</p>
                <p className="text-xs font-bold text-slate-800 truncate">{product.lightRequirement || "Bright Indirect"}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-100 flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Watering</p>
                <p className="text-xs font-bold text-slate-800 truncate">{product.waterRequirement || "Once a week"}</p>
              </div>
            </div>
          </div>

          {/* Quantity & Desktop CTAs */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-3 py-1.5 bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-500 hover:text-emerald-800 touch-active"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-900 w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-500 hover:text-emerald-800 touch-active"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition"
              >
                Buy Now Express
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-1.5">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 mx-auto mb-1" />
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-700">Eco Transit</p>
            </div>
            <div className="p-1.5">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 mx-auto mb-1" />
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-700">7-Day Guarantee</p>
            </div>
            <div className="p-1.5">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 mx-auto mb-1" />
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-700">Replacement</p>
            </div>
          </div>

        </div>
      </div>

      {/* Product Reviews & Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        <div className="flex border-b border-slate-100 gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-xs sm:text-sm font-bold transition whitespace-nowrap relative ${
              activeTab === "description" ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Care Instructions & Guide
            {activeTab === "description" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />}
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-xs sm:text-sm font-bold transition whitespace-nowrap relative ${
              activeTab === "reviews" ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Customer Reviews ({reviews.length})
            {activeTab === "reviews" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />}
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Every plant from GreenBeli is inspect-passed by senior botanists before dispatch. It comes pre-potted in lightweight, aeration-optimized organic coco peat mix.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1">🌿 Watering Instructions</h4>
                <p className="text-xs text-slate-600">Water only when the top 1-2 inches of soil feel dry to touch. Avoid overwatering.</p>
              </div>
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1">☀️ Placement Tip</h4>
                <p className="text-xs text-slate-600">Keep near bright, indirect window light. Protect from direct harsh afternoon rays.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Write a Review for {product.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Rating:</span>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this plant..."
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                {submittingReview ? "Posting..." : "Post Review"}
              </button>
            </form>

            <div className="space-y-3">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{rev.reviewerName || "Verified Buyer"}</span>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="serif-font text-xl sm:text-2xl font-bold text-slate-900">
            You Might Also Love
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <PlantCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Purchase Action Bar (<1024px screens) */}
      <div className="lg:hidden fixed bottom-[52px] left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-emerald-100 z-30 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col pl-1">
          <span className="text-[10px] text-slate-400 font-medium">Price</span>
          <span className="text-lg font-extrabold text-emerald-950">₹{product.price * quantity}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            onClick={handleAddToCart}
            disabled={added}
            className="flex-1 bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md touch-active"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            <span>{added ? "Added" : "Add"}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs shadow-md touch-active text-center"
          >
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
}