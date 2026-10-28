import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Search, Grid, List, Sparkles, X } from "lucide-react";
import PlantCard from "../components/PlantCard";
import { getProducts, getCategories } from "../utils/api";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceMax, setPriceMax] = useState(2500);
  const [careLevelFilter, setCareLevelFilter] = useState("all");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLoadError("");
      try {
        const [catsData, prodsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(catsData);
        setProducts(prodsData);
      } catch (error) {
        setLoadError(error.message || "Unable to load the catalog. Please try again.");
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Synchronize query params
  useEffect(() => {
    const cat = searchParams.get("category");
    const q = searchParams.get("search");
    if (cat !== null) setSelectedCategory(cat);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory && p.categorySlug !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }
    if (p.price > priceMax) return false;
    if (careLevelFilter !== "all" && p.careLevel !== careLevelFilter) return false;
    if (petFriendlyOnly && p.petFriendly === false) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0; // default popular
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setPriceMax(2500);
    setCareLevelFilter("all");
    setPetFriendlyOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 py-6 sm:py-10">
      
      {/* Header Title */}
      <div className="mb-6 sm:mb-8 border-b border-emerald-100 pb-4 sm:pb-6">
        <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Nursery Plant Catalog
        </span>
        <h1 className="serif-font text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
          {selectedCategory ? `${selectedCategory}` : "All Botanical Varieties"}
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
          Explore {filteredProducts.length} healthy nursery plants, planters, and organic care products.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="serif-font font-bold text-slate-900 text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-700" /> Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchParams({});
                  }}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl transition ${
                    selectedCategory === ""
                      ? "bg-emerald-800 text-white font-bold"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  All Plants & Tools
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSearchParams({ category: cat.name });
                    }}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl transition ${
                      selectedCategory === cat.name || selectedCategory === cat.slug
                        ? "bg-emerald-800 text-white font-bold"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Max Price</h4>
                <span className="text-xs font-bold text-emerald-800">₹{priceMax}</span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Care Level */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Care Difficulty</h4>
              <div className="space-y-2">
                {["all", "Easy", "Beginner Friendly", "Medium"].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="careLevel"
                      checked={careLevelFilter === lvl}
                      onChange={() => setCareLevelFilter(lvl)}
                      className="accent-emerald-600"
                    />
                    <span>{lvl === "all" ? "All Levels" : lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pet Friendly Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer">
                <span>100% Pet Friendly</span>
                <input
                  type="checkbox"
                  checked={petFriendlyOnly}
                  onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full sm:w-auto bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 touch-active"
            >
              <Filter className="w-4 h-4 text-emerald-700" /> Filters & Categories ({filteredProducts.length})
            </button>

            {/* Search within page */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-bold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid" ? "bg-emerald-800 text-white shadow" : "text-slate-400"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "list" ? "bg-emerald-800 text-white shadow" : "text-slate-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid (2 columns on mobile) */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-slate-100 rounded-2xl sm:rounded-3xl h-64 sm:h-80 animate-pulse" />
              ))}
            </div>
          ) : loadError ? (
            <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 rounded-3xl p-8 text-center text-sm">
              {loadError}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-emerald-100 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="serif-font text-lg sm:text-xl font-bold text-slate-800">No matching plants found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search query or adjusting your care & price filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-900"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <PlantCard key={product._id} product={product} variant="minimal" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-start">
          <div className="w-4/5 max-w-xs bg-white h-full p-5 shadow-2xl overflow-y-auto space-y-5 animate-fade-in flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="serif-font font-bold text-slate-900 text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-700" /> Filter Catalog
                </h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Categories</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSearchParams({});
                    }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg transition ${
                      selectedCategory === "" ? "bg-emerald-800 text-white font-bold" : "text-slate-700 hover:bg-emerald-50"
                    }`}
                  >
                    All Plants
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setSearchParams({ category: c.name });
                      }}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg transition ${
                        selectedCategory === c.name || selectedCategory === c.slug
                          ? "bg-emerald-800 text-white font-bold"
                          : "text-slate-700 hover:bg-emerald-50"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Max Price</h4>
                  <span className="text-xs font-bold text-emerald-800">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={3000}
                  step={50}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Care Difficulty */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Care Level</h4>
                <div className="space-y-2">
                  {["all", "Easy", "Beginner Friendly", "Medium"].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileCareLevel"
                        checked={careLevelFilter === lvl}
                        onChange={() => setCareLevelFilter(lvl)}
                        className="accent-emerald-600"
                      />
                      <span>{lvl === "all" ? "All Levels" : lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={clearFilters}
                className="w-full border border-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl hover:bg-slate-50"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-emerald-800 text-white text-xs font-bold py-3 rounded-xl shadow-md"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
