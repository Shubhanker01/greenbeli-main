// Centralized Admin API Client

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5007/api";


export async function adminFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = new Headers(options.headers);
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
    const responseText = await res.text();
    const data = responseText ? JSON.parse(responseText) : null;
    if (!res.ok) {
      throw new Error(data?.message || `Admin request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[Admin API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

// Admin Login
export async function loginAdminApi(email, password) {
  return await adminFetch("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Dashboard Stats
export async function getDashboardStatsApi() {
  return adminFetch("/admin/stats");
}

// Products Management
export async function getAdminProductsApi(page, limit = 10, search = "") {
  try {
    if (page !== undefined) {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      return await adminFetch(`/products/paginated?${params}`);
    }
    const data = await adminFetch("/products");
    if (Array.isArray(data.items)) return data.items;
    return [];
  } catch {
    return page !== undefined ? { items: [], total: 0, totalPages: 1 } : [];
  }
}

export async function getPosProductsApi() {
  const data = await adminFetch("/products");
  return Array.isArray(data.items) ? data.items : [];
}

export async function addProductApi(formData, authStatus) {
  if (authStatus !== "ok") {
    throw new Error("A verified admin session is required to add products.");
  }

  const res = await fetch(`${BASE_URL}/products/add`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Product request failed with status ${res.status}`);
  }
  return data;
}

export async function updateProductApi(id, productData) {
  return await adminFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function deleteProductApi(id) {
  return await adminFetch(`/products/${id}`, {
    method: "DELETE",
  });
}

// Categories Management
export async function getAdminCategoriesApi() {
  try {
    const data = await adminFetch("/categories");
    if (Array.isArray(data.items)) return data.items;
    return [];
  } catch {
    return [];
  }
}

export async function createCategoryApi(categoryData) {
  return await adminFetch("/categories", {
    method: "POST",
    body: categoryData,
  });
}

export async function updateCategoryApi(id, categoryData) {
  return await adminFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
}

export async function deleteCategoryApi(id) {
  return await adminFetch(`/categories/${id}`, {
    method: "DELETE",
  });
}

// Orders Management
export async function getAdminOrdersApi() {
  const data = await adminFetch("/admin/orders");
  return Array.isArray(data.items) ? data.items : [];
}

export async function updateOrderStatusApi(id, status) {
  return await adminFetch(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ orderStatus: status }),
  });
}

// Customers Management
export async function getAdminCustomersApi() {
  try {
    return await adminFetch("/admin/users");
  } catch {
    return [
      { _id: "usr-1", name: "Ananya Sharma", email: "ananya@example.com", phone: "+91 98765 43210", role: "customer", createdAt: "2026-06-12" },
      { _id: "usr-2", name: "Vikram Malhotra", email: "vikram@example.com", phone: "+91 98765 43211", role: "customer", createdAt: "2026-05-19" },
    ];
  }
}

export async function createCustomerApi(userData) {
  return await adminFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Leads Management
export async function getAdminLeadsApi(page = 1, limit = 10) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return await adminFetch(`/leads?${params}`);
}

export async function updateLeadStatusApi(id, status) {
  return await adminFetch(`/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteLeadStatusApi(id) {
  return await adminFetch(`/leads/${id}`, {
    method: "DELETE",
  });
}

// Proposals Management
export async function getAdminProposalsApi(page = 1, limit = 10) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const data = await adminFetch(`/proposals?${params}`);
  if (!Array.isArray(data?.proposals)) {
    throw new Error("The proposals response is invalid.");
  }
  return data;
}

export async function updateProposalApi(id, status) {
  return await adminFetch(`/proposals/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteProposalApi(id) {
  return await adminFetch(`/proposals/${id}`, {
    method: "DELETE",
  });
}

// Testimonials Management
export async function getAdminTestimonialsApi() {
  try {
    return await adminFetch("/testimonials/admin");
  } catch {
    return [
      { _id: "t-1", name: "Ananya Sharma", role: "Interior Designer", comment: "Outstanding plant quality!", rating: 5, isApproved: true },
      { _id: "t-2", name: "Kunal Kapoor", role: "Architect", comment: "Great packaging and fast shipping.", rating: 4, isApproved: false },
    ];
  }
}

export async function setTestimonialApprovalApi(id, isApproved) {
  return await adminFetch(`/testimonials/admin/${id}/approval`, {
    method: "PATCH",
    body: JSON.stringify({ isApproved }),
  });
}

export async function deleteTestimonialApi(id) {
  return await adminFetch(`/testimonials/admin/${id}`, {
    method: "DELETE",
  });
}

// Sales POS API
export async function createSaleApi(saleData) {
  return await adminFetch("/sales", {
    method: "POST",
    body: JSON.stringify(saleData),
  });
}

export async function getSaleApi(id) {
  return adminFetch(`/sales/${id}`);
}
