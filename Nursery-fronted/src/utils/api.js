// Centralized API Client for Nursery-fronted

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5007/api";
import axiosApi from "../lib/axios";

export function getToken() {
  return localStorage.getItem("nursery_user_token");
}

export const getLatestCategoriesApi = async (signal) => {
  const response = await axiosApi.get('/categories', { signal });
  return response.data; // Returns the array of categories
};

export function setToken(token) {
  if (token) localStorage.setItem("nursery_user_token", token);
  else localStorage.removeItem("nursery_user_token");
}

export function resolveImageUrl(url) {
  if (!url) return "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const backendOrigin = BASE_URL.replace(/\/api\/?$/, "");
  return `${backendOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
}

const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
    credentials: "include",
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (err) {
    console.warn(`[API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}




// Unified API helper (callable as a function or via method helpers)
export async function api(endpoint, options = {}) {
  return fetchApi(endpoint, options);
}

api.get = (endpoint) => fetchApi(endpoint, { method: "GET" });
api.post = (endpoint, body) =>
  fetchApi(endpoint, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
api.put = (endpoint, body) =>
  fetchApi(endpoint, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
api.patch = (endpoint, body) =>
  fetchApi(endpoint, {
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
api.delete = (endpoint) => fetchApi(endpoint, { method: "DELETE" });

// Product API Service
export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const data = await fetchApi(`/products?${query}`);
  if (!Array.isArray(data.items)) {
    throw new Error("The products response is invalid.");
  }
  return data.items;
}

export async function getProductsPaginated(params = {}) {
  const query = new URLSearchParams(params).toString();
  const data = await fetchApi(`/products?${query}`);
  return {
    items: Array.isArray(data.items) ? data.items : [],
    page: data.page || 1,
    limit: data.limit || 20,
    total: data.total || 0,
    hasMore: (data.page * data.limit) < data.total,
  };
}

export async function getProductBySlugOrId(idOrSlug) {
  const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
  const endpoint = isObjectId
    ? `/products/${encodeURIComponent(idOrSlug)}`
    : `/products/slug/${encodeURIComponent(idOrSlug)}`;
  const data = await fetchApi(endpoint);
  return data?._id ? data : null;
}

// Categories API Service
export async function getCategories() {
  const data = await fetchApi("/categories");
  if (!Array.isArray(data.items)) {
    throw new Error("The categories response is invalid.");
  }
  return data.items;
}

// Testimonials API Service
export async function getTestimonials() {
  const data = await fetchApi("/testimonials");
  if (!Array.isArray(data.items)) {
    throw new Error("The testimonials response is invalid.");
  }
  return data.items;
}

export async function submitTestimonial(formData) {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/testimonials`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return await res.json();
  } catch {
    return { ok: true, message: "Testimonial submitted for review!" };
  }
}

// Leads API
export async function submitLead(leadData) {
  try {
    return await fetchApi("/leads/submit", {
      method: "POST",
      body: JSON.stringify(leadData),
    });
  } catch {
    return { ok: true, message: "Inquiry received! Our plant expert will contact you shortly." };
  }
}

// Proposals API
export async function submitProposal(proposalData) {
  return await fetchApi("/proposals", {
    method: "POST",
    body: JSON.stringify(proposalData),
  });
}

// User Auth APIs
export async function loginUser(email, password) {
  return await fetchApi("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(userData) {
  return await fetchApi("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getCurrentUserProfile() {
  return await fetchApi("/me");
}

export async function getAuthSession() {
  try {
    const data = await fetchApi("/session");
    if (data.status === "unauthenticated") {
      return { user: null };
    }
    if (!data.user || typeof data.user.email !== "string") {
      throw new Error("The session response is invalid.");
    }
    return { user: data.user };
  } catch (error) {
    if (error.status === 401) {
      return { user: null };
    }
    throw error;
  }
}

export async function logoutUser() {
  return await fetchApi("/logout", { method: "POST" });
}

export async function updateUserProfile(profileData) {
  return await fetchApi("/update-profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

// Cart API
export async function getUserCart() {
  return await fetchApi("/cart");
}

export async function addToCartApi(productId, quantity = 1) {
  return await fetchApi("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartQuantityApi(productId, quantity) {
  return await fetchApi(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCartApi(productId) {
  return await fetchApi(`/cart/items/${productId}`, {
    method: "DELETE",
  });
}

export async function clearCartApi() {
  return await fetchApi("/cart", {
    method: "DELETE",
  });
}

// Orders API
export async function createOrderApi(orderPayload) {
  return await fetchApi("/orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });
}

export async function getMyOrdersApi() {
  return await fetchApi("/orders");
}
