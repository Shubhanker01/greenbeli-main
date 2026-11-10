import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import RequireAdmin from "./components/RequireAdmin";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

// Direct import only for login (initial landing screen)
import Login from "./pages/Login";

// Lazy-load all protected admin views so their code, endpoints, and components are NOT downloaded on /login
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const ProductForm = lazy(() => import("./pages/ProductForm"));
const Categories = lazy(() => import("./pages/Categories"));
const CategoryForm = lazy(() => import("./pages/CategoryForm"));
const Orders = lazy(() => import("./pages/Orders"));
const Customers = lazy(() => import("./pages/Customers"));
const Leads = lazy(() => import("./pages/Leads"));
const Proposals = lazy(() => import("./pages/Proposals"));
const Sales = lazy(() => import("./pages/Sales"));
const SalesReceipt = lazy(() => import("./pages/SalesReceipt"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Settings = lazy(() => import("./pages/Settings"));
const MfaEnrollmentPage = lazy(() => import("./pages/MfaEnrollment"));
const MfaVerifyPage = lazy(() => import("./pages/MfaVerify"));
const ResetMfa = lazy(() => import("./pages/ResetMfa"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Journals = lazy(() => import("./pages/Journal"));
const Faqs = lazy(() => import("./pages/Faqs"));
const PlantGuides = lazy(() => import("./pages/PlantGuides"));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col font-sans">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<PageLoader />}>
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
              <Route path="journals" element={<Journals/>}></Route>
              <Route path="faqs" element={<Faqs />} />
              <Route path="plant-guides" element={<PlantGuides />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}