import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  Sparkles, 
  Eye, 
  Plus, 
  Check, 
  Heart, 
  Filter, 
  RotateCw, 
  X,
  Star,
  Sun,
  Droplets
} from "lucide-react";
import { getProductsPaginated, getCategories, resolveImageUrl } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const PAGE_SIZE = 9;

export default function Gallery() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // Preview modal for enlarged image showcase
  const [previewItem, setPreviewItem] = useState(null);
  const [addedIds, setAddedIds] = useState({});

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.warn("Could not load categories for gallery filter", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products function
  const fetchProducts = useCallback(async (pageNum, categoryId, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError("");
    }

    try {
      const params = {
        page: pageNum,
        limit: PAGE_SIZE,
      };
      if (categoryId && categoryId !== "all") {
        params.categoryId = categoryId;
      }

      const res = await getProductsPaginated(params);

      setProducts((prev) => (append ? [...prev, ...res.items] : res.items));
      setTotalCount(res.total);
      setHasMore(res.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || "Failed to load nursery botanical showcase.");
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // When category changes, reload from page 1
  useEffect(() => {
    fetchProducts(1, selectedCategory, false);
  }, [selectedCategory, fetchProducts]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    fetchProducts(page + 1, selectedCategory, true);
  }, [loading, loadingMore, hasMore, page, selectedCategory, fetchProducts]);

  // Infinite scroll hook
  const sentinelRef = useInfiniteScroll(handleLoadMore, {
    enabled: hasMore && !loading && !loadingMore,
    rootMargin: "300px",
  });

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="bg-cream min-h-screen text-slate-800 pb-20 sm:pb-28 overflow-hidden">
      
      {/* ----------------- 1. HEADER (Home Page Aesthetic) ----------------- */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.7),transparent_60%)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <Reveal>
            <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
              Living Botanical Archive
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1
              style={{ color: GREEN }}
              className="serif-font text-4xl sm:text-6xl lg:text-[4.75rem] font-medium leading-[1.05] tracking-tight"
            >
              Nursery Project & Plant Gallery
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our organically grown specimens, interior styling projects, and balcony foliage inspirations currently available across our greenhouse.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------- 2. CATEGORY FILTER TABS (Consistent Pill Buttons) ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            style={
              selectedCategory === "all"
                ? { backgroundColor: GREEN, borderColor: GREEN }
                : { color: GREEN, borderColor: `${GREEN}40` }
            }
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition whitespace-nowrap touch-active ${
              selectedCategory === "all"
                ? "text-white shadow-md shadow-emerald-950/15"
                : "bg-white/50 hover:bg-white"
            }`}
          >
            All Botanical Works ({totalCount})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                style={
                  isSelected
                    ? { backgroundColor: GREEN, borderColor: GREEN }
                    : { color: GREEN, borderColor: `${GREEN}40` }
                }
                className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition whitespace-nowrap touch-active ${
                  isSelected
                    ? "text-white shadow-md shadow-emerald-950/15"
                    : "bg-white/50 hover:bg-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ----------------- 3. DYNAMIC GALLERY GRID (Photo-First, No Card) ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {error && (
          <div role="alert" className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-sm text-center mb-8">
            {error}
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="space-y-3">
                <div className="aspect-[4/5] bg-emerald-100/60 rounded-md animate-pulse" />
                <div className="h-5 w-2/3 bg-emerald-100/60 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-emerald-100/60 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="serif-font text-2xl font-bold text-[#1f4a34]">No botanical entries found</p>
            <p className="text-stone-600 text-sm sm:text-base">Try selecting another category or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
            {products.map((item, index) => {
              const imageUrl = resolveImageUrl(item.images?.[0] || item.image);
              const categoryTitle = item.categoryId?.name || item.category || "Indoor Botanical";
              const isLiked = isInWishlist(item._id);
              const isAdded = !!addedIds[item._id];

              return (
                <div
                  key={`${item._id}-${index}`}
                  className="group flex flex-col h-full touch-active"
                >
                  {/* Clean Image Canvas (No Card Wrapper, Home Page Visuals) */}
                  <div className="relative aspect-[4/5] sm:aspect-[8/9] overflow-hidden rounded-md bg-emerald-100/60 shadow-xs">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />

                    {/* Care & Botanical Tag */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col items-start gap-1.5 z-10 pointer-events-none">
                      <span className="bg-white/95 text-[#1f4a34] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm shadow-sm">
                        {item.careLevel || categoryTitle}
                      </span>
                    </div>

                    {/* Wishlist toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, item)}
                      aria-label="Add to wishlist"
                      className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full transition z-10 shadow-sm ${
                        isLiked ? "bg-rose-500 text-white" : "bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                    </button>

                    {/* Floating Hover Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d261a]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 sm:p-5 z-10">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-md hover:bg-white/30 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Photo
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, item)}
                        disabled={isAdded}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md ${
                          isAdded ? "bg-emerald-600 text-white" : "bg-white text-[#1f4a34] hover:bg-[#1f4a34] hover:text-white"
                        }`}
                        title="Add to shopping bag"
                      >
                        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Botanical Details Beneath Image */}
                  <div className="pt-3.5 sm:pt-4 flex flex-col flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/products/${item.slug || item._id}`} className="min-w-0">
                        <h3 className="serif-font text-xl sm:text-2xl font-bold text-[#1f4a34] group-hover:underline underline-offset-4 decoration-2 leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      <span className="text-lg sm:text-xl font-bold text-[#1f4a34] shrink-0">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-1">
                      {item.botanicalName || item.shortDescription || item.description || categoryTitle}
                    </p>

                    <div className="pt-2 mt-auto flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating || 4.8}
                      </span>
                      <Link
                        to={`/products/${item.slug || item._id}`}
                        className="inline-flex items-center gap-1 text-[#1f4a34] font-semibold hover:underline"
                      >
                        Botanical Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------- 4. INFINITE SCROLL SENTINEL & FALLBACK LOAD MORE ----------------- */}
        <div className="pt-12 sm:pt-16 pb-8 flex flex-col items-center justify-center text-center">
          {/* Intersection Observer Sentinel Anchor */}
          <div ref={sentinelRef} className="h-6 w-full" aria-hidden="true" />

          {loadingMore && (
            <div className="flex items-center gap-3 text-sm font-semibold text-[#1f4a34]">
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Nurturing more green botanical works...</span>
            </div>
          )}

          {/* Explicit Fallback Load More Button */}
          {!loading && !loadingMore && hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              style={{ backgroundColor: GREEN }}
              className="mt-4 inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-3.5 rounded-md shadow-md hover:brightness-90 transition touch-active"
            >
              Load More Gallery Plants
              <Plus className="w-4 h-4" />
            </button>
          )}

          {!hasMore && products.length > 0 && (
            <p className="text-xs sm:text-sm text-stone-500 font-medium pt-4">
              🌿 You have explored all {totalCount} botanical exhibits in this collection.
            </p>
          )}
        </div>

      </section>

      {/* ----------------- 5. LIGHTBOX MODAL FOR PREVIEW ----------------- */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-cream rounded-md overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition z-10"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-md bg-stone-900">
              <img
                src={resolveImageUrl(previewItem.images?.[0] || previewItem.image)}
                alt={previewItem.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span style={{ color: GREEN }} className="text-xs font-bold uppercase tracking-wider">
                  {previewItem.categoryId?.name || previewItem.category || "Botanical Exhibit"}
                </span>
                <h3 className="serif-font text-2xl font-bold text-[#1f4a34]">
                  {previewItem.name}
                </h3>
                {previewItem.botanicalName && (
                  <p className="text-xs text-stone-500 italic">{previewItem.botanicalName}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#1f4a34]">₹{previewItem.price}</span>
                <Link
                  to={`/products/${previewItem.slug || previewItem._id}`}
                  style={{ backgroundColor: GREEN }}
                  className="inline-flex items-center gap-2 text-white text-xs font-semibold px-5 py-3 rounded-md hover:brightness-90 transition"
                >
                  View Product Page <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
