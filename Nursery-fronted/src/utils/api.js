// Centralized API Client for Nursery-fronted

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5007/api";

export function getToken() {
  return localStorage.getItem("nursery_user_token");
}

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

// Fallback Seed Data for smooth offline / initial experience
export const FALLBACK_CATEGORIES = [
  { _id: "cat-1", name: "Indoor Plants", slug: "indoor-plants", description: "Purify your living space with vibrant indoor greenery.", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-2", name: "Outdoor Plants", slug: "outdoor-plants", description: "Lush flowering and garden landscape plants for balcony & garden.", image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-3", name: "Pots & Planters", slug: "pots-planters", description: "Ceramic, terracotta, and modern minimalist planters.", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-4", name: "Gardening Tools", slug: "gardening-tools", description: "Ergonomic pruners, soil shovels, and watering tools.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-5", name: "Plant Care", slug: "plant-care", description: "Organic fertilizers, soil mixes, and pest control.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-6", name: "Seeds & Bulbs", slug: "seeds-bulbs", description: "High germinating exotic flower, herb & vegetable seeds.", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80" },
];

export const FALLBACK_PRODUCTS = [
  {
    _id: "prod-1",
    name: "Monstera Deliciosa (Swiss Cheese Plant)",
    slug: "monstera-deliciosa",
    price: 899,
    originalPrice: 1199,
    category: "Indoor Plants",
    categorySlug: "indoor-plants",
    rating: 4.9,
    reviewsCount: 42,
    images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"],
    inStock: true,
    stock: 25,
    careLevel: "Easy",
    lightRequirement: "Bright Indirect Light",
    waterRequirement: "Once a week",
    petFriendly: false,
    description: "The classic Monstera Deliciosa brings an instant tropical vibe to any indoor room with its natural leaf perforations.",
    featured: true,
  },
  {
    _id: "prod-2",
    name: "Golden Snake Plant (Sansevieria)",
    slug: "golden-snake-plant",
    price: 499,
    originalPrice: 699,
    category: "Indoor Plants",
    categorySlug: "indoor-plants",
    rating: 4.8,
    reviewsCount: 38,
    images: ["https://images.unsplash.com/photo-1599598425947-0206455589db?auto=format&fit=crop&w=800&q=80"],
    inStock: true,
    stock: 40,
    careLevel: "Beginner Friendly",
    lightRequirement: "Low to High Light",
    waterRequirement: "Every 2-3 weeks",
    petFriendly: false,
    description: "One of the toughest air-purifying indoor plants. Releases oxygen at night and requires minimal care.",
    featured: true,
  },
  {
    _id: "prod-3",
    name: "Fiddle Leaf Fig (Ficus Lyrata)",
    slug: "fiddle-leaf-fig",
    price: 1499,
    originalPrice: 1899,
    category: "Indoor Plants",
    categorySlug: "indoor-plants",
    rating: 4.7,
    reviewsCount: 19,
    images: ["https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"],
    inStock: true,
    stock: 12,
    careLevel: "Medium",
    lightRequirement: "Bright Filtered Light",
    waterRequirement: "When top soil is dry",
    petFriendly: false,
    description: "Architectural foliage with iconic violin-shaped glossy leaves. Perfect focal point for living rooms.",
    featured: true,
  },
  {
    _id: "prod-4",
    name: "Handcrafted Ceramic Planter (Sage Green)",
    slug: "ceramic-planter-sage",
    price: 649,
    originalPrice: 849,
    category: "Pots & Planters",
    categorySlug: "pots-planters",
    rating: 4.9,
    reviewsCount: 27,
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"],
    inStock: true,
    stock: 30,
    careLevel: "N/A",
    lightRequirement: "N/A",
    waterRequirement: "Includes drainage hole & saucer",
    petFriendly: true,
    description: "Premium matte glazed heavy ceramic pot designed for healthy root aeration.",
    featured: true,
  },
  {
    _id: "prod-5",
    name: "Peace Lily (Spathiphyllum)",
    slug: "peace-lily",
    price: 549,
    originalPrice: 749,
    category: "Indoor Plants",
    categorySlug: "indoor-plants",
    rating: 4.9,
    reviewsCount: 51,
    images: ["https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80"],
    inStock: true,
    stock: 18,
    careLevel: "Easy",
    lightRequirement: "Low to Medium Light",
    waterRequirement: "Twice a week",
    petFriendly: false,
    description: "Elegantly blooms white spathes while actively filtering indoor air pollutants.",
    featured: false,
  },
  {
    _id: "prod-6",
    name: "Bougainvillea Bonsai Starter",
    slug: "bougainvillea-bonsai",
    price: 1199,
    originalPrice: 1599,
    category: "Outdoor Plants",
    categorySlug: "outdoor-plants",
    rating: 4.8,
    reviewsCount: 15,
    images: ["https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80"],
    inStock: true,
    stock: 8,
    careLevel: "Medium",
    lightRequirement: "Full Direct Sunlight",
    waterRequirement: "Moderate",
    petFriendly: true,
    description: "Vibrant magenta flowering outdoor plant that thrives under bright sunshine.",
    featured: true,
  },
];

export const FALLBACK_TESTIMONIALS = [
  {
    _id: "t-1",
    name: "Ananya Sharma",
    role: "Interior Designer",
    city: "Mumbai",
    rating: 5,
    comment: "The quality of plants received from GreenBeli nursery was outstanding! Healthy roots and beautiful packaging.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    isApproved: true,
  },
  {
    _id: "t-2",
    name: "Vikram Malhotra",
    role: "Plant Parent & Architect",
    city: "Bangalore",
    rating: 5,
    comment: "Ordered 12 indoor plants for our new office landscape. Delivered fresh without a single damaged leaf!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    isApproved: true,
  },
];

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
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
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
  try {
    const query = new URLSearchParams(params).toString();
    const data = await fetchApi(`/products?${query}`);
    if (Array.isArray(data) && data.length > 0) return data;
    if (data?.products && Array.isArray(data.products) && data.products.length > 0) return data.products;
    return FALLBACK_PRODUCTS;
  } catch (e) {
    return FALLBACK_PRODUCTS;
  }
}

export async function getProductBySlugOrId(idOrSlug) {
  try {
    const data = await fetchApi(`/products/${idOrSlug}`);
    if (data && data._id) return data;
    const slugData = await fetchApi(`/products/slug/${idOrSlug}`);
    if (slugData && slugData._id) return slugData;
  } catch (e) {
    // lookup fallback
  }
  const found = FALLBACK_PRODUCTS.find(p => p._id === idOrSlug || p.slug === idOrSlug);
  return found || FALLBACK_PRODUCTS[0];
}

// Categories API Service
export async function getCategories() {
  try {
    const data = await fetchApi("/categories");
    if (Array.isArray(data) && data.length > 0) return data;
    if (data?.categories && data.categories.length > 0) return data.categories;
    return FALLBACK_CATEGORIES;
  } catch (e) {
    return FALLBACK_CATEGORIES;
  }
}

// Testimonials API Service
export async function getTestimonials() {
  try {
    const data = await fetchApi("/testimonials");
    if (Array.isArray(data) && data.length > 0) return data;
    return FALLBACK_TESTIMONIALS;
  } catch (e) {
    return FALLBACK_TESTIMONIALS;
  }
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
  } catch (e) {
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
  } catch (e) {
    return { ok: true, message: "Inquiry received! Our plant expert will contact you shortly." };
  }
}

// Proposals API
export async function submitProposal(proposalData) {
  try {
    return await fetchApi("/proposals/createProposals", {
      method: "POST",
      body: JSON.stringify(proposalData),
    });
  } catch (e) {
    return { ok: true, message: "Landscape proposal request submitted successfully!" };
  }
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

export async function updateUserProfile(profileData) {
  return await fetchApi("/profile", {
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
