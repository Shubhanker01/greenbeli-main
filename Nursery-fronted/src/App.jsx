import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SystemSettingProvider } from "./context/SystemSettingsContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import CartDrawer from "./components/CartDrawer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import ProductCategoryPage from "./pages/ProductCategoryPage";
// import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import OurStory from "./pages/OurStory";
import OurJournal from "./pages/OurJournal";
import OurGrowers from "./pages/OurGrowers";
import PlantCareGuides from "./pages/PlantCareGuides";
import ShippingReturns from "./pages/ShippingReturns";
import FAQs from "./pages/FAQs";
import GiftCards from "./pages/GiftCards";
import Gallery from "./pages/Gallery";
import Proposals from "./pages/Proposals";
import Testimonials from "./pages/Testimonials";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmEmail from "./pages/ConfirmEmail";

export default function App() {
  return (
    <SystemSettingProvider>
      <AuthProvider>
          <div className="min-h-screen flex flex-col justify-between bg-cream selection:bg-emerald-200 selection:text-emerald-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<SingleProduct />} />
                <Route path="/product/:id" element={<SingleProduct />} />
                <Route path="/category/:slug" element={<ProductCategoryPage />} />
                {/* <Route path="/cart" element={<Cart />} /> */}
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
                {/* Fallback route */}
                <Route path="*" element={<Products />} />
              </Routes>
            </main>
            {/* <CartDrawer /> */}
            <Footer />
          </div>
      </AuthProvider>
    </SystemSettingProvider>
  );
}
