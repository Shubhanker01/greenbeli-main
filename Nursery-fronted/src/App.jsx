import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SystemSettingProvider } from "./context/SystemSettingsContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

// Lazy load route pages for code splitting and faster initial load
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const ProductCategoryPage = lazy(() => import("./pages/ProductCategoryPage"));
const ProductCategoryRoute = lazy(() => import("./pages/ProductCategoryRoute"));
const Cart = lazy(() => import("./pages/Cart"));
const Orders = lazy(() => import("./pages/Orders"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const OurStory = lazy(() => import("./pages/OurStory"));
const OurJournal = lazy(() => import("./pages/OurJournal"));
const OurGrowers = lazy(() => import("./pages/OurGrowers"));
const PlantCareGuides = lazy(() => import("./pages/PlantCareGuides"));
const ShippingReturns = lazy(() => import("./pages/ShippingReturns"));
const FAQs = lazy(() => import("./pages/FAQs"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Proposals = lazy(() => import("./pages/Proposals"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <SystemSettingProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col justify-between bg-cream selection:bg-emerald-200 selection:text-emerald-950">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<SingleProduct />} />
                  <Route path="/product/:id" element={<SingleProduct />} />
                  <Route path="/category/:slug" element={<ProductCategoryPage />} />
                  <Route path="/products/category/:categorySlug" element={<ProductCategoryRoute />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/journal" element={<OurJournal />} />
                  <Route path="/our-growers" element={<OurGrowers />} />
                  <Route path="/plant-care-guides" element={<PlantCareGuides />} />
                  <Route path="/shipping-returns" element={<ShippingReturns />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/gift-cards" element={<GiftCards />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/proposals" element={<Proposals />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/confirm-email" element={<ConfirmEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  {/* Fallback route */}
                  <Route path="*" element={<Products />} />
                </Routes>
              </Suspense>
            </main>
            <CartDrawer />
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </SystemSettingProvider>
  );
}
