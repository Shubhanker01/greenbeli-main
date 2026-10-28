import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import RequireAdmin from "./components/RequireAdmin";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Categories from "./pages/Categories";
import CategoryForm from "./pages/CategoryForm";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Proposals from "./pages/Proposals";
import Sales from "./pages/Sales";
import SalesReceipt from "./pages/SalesReceipt";
import Testimonials from "./pages/Testimonials";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import MfaEnrollmentPage from "./pages/MfaEnrollment";
import MfaVerifyPage from "./pages/MfaVerify";
import ResetMfa from "./pages/ResetMfa";
import ResetPassword from "./pages/ResetPassword";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col font-sans">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/mfa-enrollment" element={<MfaEnrollmentPage />} />
        <Route path="/mfa-verify" element={<MfaVerifyPage />} />
        <Route path="/reset-mfa" element={<ResetMfa />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Protected: must be a logged-in admin with a verified MFA session */}
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="leads" element={<Leads />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales/:id" element={<SalesReceipt />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}