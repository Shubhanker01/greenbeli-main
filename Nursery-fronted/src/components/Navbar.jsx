import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Sprout, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Leaf, 
  ChevronDown, 
  LogOut,
  PackageCheck,
  Sparkles,
  PhoneCall,
  Grid,
  Sparkle,
  Flower2,
  TreePine,
  Wrench,
  Image as GalleryIcon,
  MessageSquareQuote,
  Info,
  Send,
  Home as HomeIcon,
  LayoutGrid
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, wishlist, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);

  const shopDropdownRef = useRef(null);
  const exploreDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setIsShopDropdownOpen(false);
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target)) {
        setIsExploreDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shopCategories = [
    { name: "All Plants & Garden", path: "/products", icon: Grid, desc: "Explore entire 100% organic botanical store" },
    { name: "Indoor Air Purifiers", path: "/category/indoor-plants", icon: Flower2, desc: "Low light & air-cleansing foliage" },
    { name: "Outdoor & Balcony", path: "/category/outdoor-plants", icon: TreePine, desc: "Flowering patio & garden greenery" },
    { name: "Designer Pots & Planters", path: "/category/pots-planters", icon: Leaf, desc: "Ceramic & matte minimalist pots" },
    { name: "Organic Plant Care", path: "/category/plant-care", icon: Sparkle, desc: "Potting mix, fertilizers & nutrition" },
    { name: "Gardening Tools", path: "/category/gardening-tools", icon: Wrench, desc: "Pruners, sprayers & tools" },
  ];

  const exploreLinks = [
    { name: "Gallery Showcase", path: "/gallery", icon: GalleryIcon, desc: "Real customer garden transformations" },
    { name: "Customer Reviews", path: "/testimonials", icon: MessageSquareQuote, desc: "Stories from happy plant parents" },
    { name: "Our Botanical Story", path: "/about", icon: Info, desc: "Learn about GreenBeli nursery heritage" },
    { name: "Get in Touch", path: "/contact", icon: Send, desc: "Consult our plant expert team" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Top Banner */}
        <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-between font-medium border-b border-emerald-900/60">
          <div className="flex items-center gap-1.5 sm:gap-2 mx-auto sm:mx-0 truncate">
            <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider shrink-0">
              Special
            </span>
            <span className="truncate">🌱 20% OFF indoor plants! Code: <b className="text-emerald-300 font-extrabold">GREEN20</b></span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-emerald-300">
            <a href="tel:+919950711475" className="flex items-center gap-1.5 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5" /> +91 9950711475
            </a>
            <span>Free Express Delivery Over ₹499</span>
          </div>
        </div>

        {/* Main Glass Navbar */}
        <nav className="glass-nav py-2.5 px-3 sm:px-8 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-emerald-900 hover:text-emerald-700 focus:outline-none touch-active"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="serif-font text-xl sm:text-2xl font-bold text-emerald-950 tracking-tight leading-none group-hover:text-emerald-700 transition">
                  GreenBeli
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-widest text-emerald-700 uppercase font-semibold">
                  Nursery & Botanical
                </span>
              </div>
            </Link>

            {/* Streamlined Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
              {/* 1. Home */}
              <Link
                to="/"
                className={`transition-colors py-2 relative hover:text-emerald-700 ${
                  location.pathname === "/" ? "text-emerald-800 font-semibold" : ""
                }`}
              >
                Home
                {location.pathname === "/" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>

              {/* 2. Direct "All Plants" Link */}
              <Link
                to="/products"
                className={`transition-colors py-2 relative hover:text-emerald-700 ${
                  location.pathname === "/products" ? "text-emerald-800 font-semibold" : ""
                }`}
              >
                All Plants
                {location.pathname === "/products" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>

              {/* 3. Categories Dropdown */}
              <div
                ref={shopDropdownRef}
                className="relative"
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <button
                  onClick={() => navigate("/products")}
                  className={`flex items-center gap-1 py-2 transition-colors hover:text-emerald-700 ${
                    location.pathname.startsWith("/category") ? "text-emerald-800 font-semibold" : ""
                  }`}
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isShopDropdownOpen ? "rotate-180 text-emerald-600" : "text-slate-400"}`} />
                </button>

                {/* Dropdown Panel */}
                {isShopDropdownOpen && (
                  <div className="absolute top-full -left-4 mt-1 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 grid grid-cols-1 gap-1 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Plant & Garden Categories</span>
                      <Link to="/products" onClick={() => setIsShopDropdownOpen(false)} className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full hover:bg-emerald-200 transition">
                        View All
                      </Link>
                    </div>
                    {shopCategories.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsShopDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition group"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">{item.name}</p>
                            <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Landscaping Proposals */}
              <Link
                to="/proposals"
                className={`transition-colors py-2 relative flex items-center gap-1.5 hover:text-emerald-700 ${
                  location.pathname === "/proposals" ? "text-emerald-800 font-semibold" : ""
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Landscaping
                {location.pathname === "/proposals" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>

              {/* 5. Explore Dropdown */}
              <div
                ref={exploreDropdownRef}
                className="relative"
                onMouseEnter={() => setIsExploreDropdownOpen(true)}
                onMouseLeave={() => setIsExploreDropdownOpen(false)}
              >
                <button
                  onClick={() => setIsExploreDropdownOpen(!isExploreDropdownOpen)}
                  className={`flex items-center gap-1 py-2 transition-colors hover:text-emerald-700 ${
                    ["/gallery", "/testimonials", "/about", "/contact"].includes(location.pathname)
                      ? "text-emerald-800 font-semibold"
                      : ""
                  }`}
                >
                  Explore
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExploreDropdownOpen ? "rotate-180 text-emerald-600" : "text-slate-400"}`} />
                </button>

                {isExploreDropdownOpen && (
                  <div className="absolute top-full -left-4 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 grid grid-cols-1 gap-1 z-50 animate-fade-in">
                    {exploreLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsExploreDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition group"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">{item.name}</p>
                            <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 sm:p-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition touch-active"
                title="Search Plants"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/profile?tab=wishlist"
                className="relative p-1.5 sm:p-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition hidden sm:inline-flex"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition flex items-center gap-1.5 touch-active"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="bg-emerald-700 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5 shadow">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Profile Menu */}
              <div ref={profileDropdownRef} className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 pl-2.5 sm:pl-3 border border-emerald-200 rounded-full hover:bg-emerald-50 transition text-emerald-950 font-medium text-xs shadow-xs touch-active"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold uppercase">
                        {user?.name ? user.name[0] : "U"}
                      </span>
                      <span
                        className="hidden sm:inline max-w-[130px] lg:max-w-[160px] truncate"
                        title={user?.email || user?.name || "Account"}
                      >
                        {user?.email || user?.name || "Account"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                        >
                          <User className="w-4 h-4 text-emerald-600" /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                        >
                          <PackageCheck className="w-4 h-4 text-emerald-600" /> My Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                            navigate("/");
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition border-t border-slate-100"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold shadow-md shadow-emerald-900/10 flex items-center gap-1 transition duration-300 touch-active"
                  >
                    <User className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-start">
            <div className="w-4/5 max-w-xs bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-6 h-6 text-emerald-700" />
                    <span className="serif-font font-bold text-lg text-emerald-950">GreenBeli</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-1 mt-4">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition"
                  >
                    Home
                  </Link>

                  <Link
                    to="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-2"
                  >
                    <Grid className="w-4 h-4 text-emerald-700" />
                    All Plants & Products
                  </Link>

                  <div className="py-2 border-t border-b border-slate-100 my-1">
                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Shop Categories</p>
                    {shopCategories.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 transition flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/proposals"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition flex items-center justify-between"
                  >
                    <span>Landscaping Proposals</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </Link>

                  <div className="pt-2">
                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Explore GreenBeli</p>
                    {exploreLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 transition flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-emerald-800 text-white text-center py-2.5 rounded-xl text-sm font-semibold block shadow-md"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-100 animate-fade-in">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
                <span className="serif-font font-bold text-base sm:text-lg text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> Search Botanical Catalog
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Monstera, Snake Plant, Pots..."
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-20 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:bg-emerald-900 transition shadow-xs"
                >
                  Search
                </button>
              </form>

              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["Monstera", "Indoor Air Purifying", "Pots & Planters", "Succulents", "Fiddle Leaf", "Fertilizer"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          navigate(`/products?search=${encodeURIComponent(tag)}`);
                          setIsSearchOpen(false);
                        }}
                        className="bg-emerald-50 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-emerald-100 transition"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Glassmorphic Mobile Bottom Navigation Bar (<640px screens) */}
      <div className="glass-bottom-bar fixed bottom-0 left-0 right-0 z-40 sm:hidden py-1 px-4 flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition touch-active ${
            location.pathname === "/" ? "text-emerald-700 font-bold" : "text-slate-500"
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/products"
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition touch-active ${
            location.pathname.startsWith("/products") || location.pathname.startsWith("/category")
              ? "text-emerald-700 font-bold"
              : "text-slate-500"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Shop</span>
        </Link>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-slate-500 transition touch-active"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-slate-500 relative transition touch-active"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-700 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition touch-active ${
            ["/profile", "/login", "/orders"].includes(location.pathname) ? "text-emerald-700 font-bold" : "text-slate-500"
          }`}
        >
          <User className="w-5 h-5" />
          <span>{isAuthenticated ? "Profile" : "Account"}</span>
        </Link>
      </div>
    </>
  );
}
