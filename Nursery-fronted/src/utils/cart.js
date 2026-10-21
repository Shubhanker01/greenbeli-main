import { getCurrentUser } from './userStore'
import { api, resolveImageUrl } from './api'

function notifyCartChange() {
  window.dispatchEvent(new Event('cartchange'))
}

function unitPrice(p) {
  if (!p) return 0
  const price = Number(p.price || 0)
  const disc = Number(p.discount || 0)
  if (p.discountType === 'percent') {
    return Math.max(0, price - (price * disc) / 100)
  }
  return Math.max(0, price - disc)
}

/** Normalize API cart lines for UI */
export function mapCartLines(cartDoc) {
  const lines = cartDoc?.Products || []
  return lines.map((line) => {
    const p = line.productId
    const id = p?._id || line.productId
    const img = resolveImageUrl(p?.mainImage || p?.images?.[0] || p?.image?.[0] || '')
    return {
      id: String(id),
      productId: String(id),
      name: p?.name || 'Product',
      price: p ? unitPrice(p) : 0,
      image: img,
      quantity: line.quantity,
      category: p?.categoryId?.name || p?.categoryId?.slug || '',
    }
  })
}

export async function fetchCart() {
  if (!getCurrentUser()) return { lines: [], total: 0 }
  const cart = await api('/cart')
  const lines = mapCartLines(cart)
  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0)
  return { lines, total, raw: cart }
}

export async function addCartItemByProductId(productId, quantity = 1) {
  if (!getCurrentUser()) {
    return { ok: false, message: 'Please login to add items to cart.' }
  }
  const pid = String(productId || '').trim()
  const qty = Number(quantity)
  if (!pid || pid.length !== 24) {
    return { ok: false, message: 'Invalid product selected.' }
  }
  if (!Number.isFinite(qty) || qty <= 0) {
    return { ok: false, message: 'Quantity must be greater than 0.' }
  }
  try {
    await api('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId: pid, quantity: qty }),
    })
    notifyCartChange()
    return { ok: true }
  } catch (e) {
    return { ok: false, message: e.message }
  }
}

/** @deprecated use addCartItemByProductId — kept for gradual migration */
export async function addCartItem(product) {
  const pid = product.productId || product.id
  if (!pid) return { ok: false, message: 'Invalid product.' }
  return addCartItemByProductId(pid, product.quantity || 1)
}

export async function updateCartItemQuantity(productId, quantity) {
  if (!getCurrentUser()) return
  try {
    await api(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
    notifyCartChange()
  } catch {
    notifyCartChange()
  }
}

export async function getCartCount() {
  if (!getCurrentUser()) return 0
  try {
    const { lines } = await fetchCart()
    return lines.reduce((t, l) => t + l.quantity, 0)
  } catch {
    return 0
  }
}

export async function getCartTotal() {
  if (!getCurrentUser()) return 0
  try {
    const { total } = await fetchCart()
    return total
  } catch {
    return 0
  }
}

export async function getActivitySummary() {
  const currentUser = getCurrentUser()
  let items = []
  let totalPlants = 0
  let totalSpent = 0
  if (currentUser) {
    try {
      const { lines, total } = await fetchCart()
      items = lines
      totalPlants = lines.reduce((s, l) => s + l.quantity, 0)
      totalSpent = total
    } catch {
      /* ignore */
    }
  }
  return {
    currentUser,
    items,
    totalPlants,
    totalSpent,
    rewardPoints: totalPlants * 25,
  }
}

export async function placeOrder({ shippingInfo, paymentInfo }) {
  return api('/orders', {
    method: 'POST',
    body: JSON.stringify({ shippingInfo, paymentInfo }),
  })
}
