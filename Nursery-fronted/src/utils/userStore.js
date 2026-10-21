import { api, setToken, getToken } from './api'

const USER_KEY = 'nursery_user'

function notifyAuthChange() {
  window.dispatchEvent(new Event('authchange'))
}

function persistUser(user) {
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  else window.localStorage.removeItem(USER_KEY)
}

export function getCurrentUser() {
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

function mapUser(u) {
  if (!u) return null
  const name = u.name || u.fullName || u.email || 'Customer'
  return {
    id: u.id || u._id,
    fullName: name,
    name,
    email: u.email,
    phone: u.phone || '',
    gender: u.gender || '',
    dateOfBirth: u.dateOfBirth || '',
    address: {
      street: u.address?.street || '',
      city: u.address?.city || u.city || '',
      state: u.address?.state || '',
      postalCode: u.address?.postalCode || '',
      country: u.address?.country || '',
    },
    city: u.city || u.address?.city || '',
  }
}

export async function registerUser(payload) {
  const { fullName, email, password, phone, address, city } = payload
  if (!fullName || !email || !password) {
    return { ok: false, message: 'Name, email and password are required.' }
  }
  try {
    const res = await api('/register', {
      method: 'POST',
      body: JSON.stringify({
        name: fullName,
        email,
        password,
        phone,
        address,
        city,
      }),
    })
    setToken(res.token)
    const user = mapUser({ ...res.user, phone, address, city })
    persistUser(user)
    notifyAuthChange()
    return { ok: true, user }
  } catch (e) {
    return { ok: false, message: e.message || 'Registration failed.' }
  }
}

    export async function loginUser(email, password) {
    if (!email || !password) {
        return { ok: false, message: 'Email and password are required.' }
    }
    try {
        const res = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        })
        setToken(res.token)
        const user = mapUser(res.user)
        persistUser(user)
        notifyAuthChange()
        return { ok: true, user }
    } catch (e) {
        return { ok: false, message: e.message || 'Invalid email or password.' }
    }
    }

export async function logoutUser() {
  try {
    if (getToken()) await api('/logout', { method: 'POST' })
  } catch {
    /* ignore */
  }
  setToken(null)
  persistUser(null)
  notifyAuthChange()
}

export async function refreshMe() {
  if (!getToken()) return null
  try {
    const res = await api('/me')
    const user = mapUser(res.user)
    persistUser(user)
    notifyAuthChange()
    return user
  } catch {
    setToken(null)
    persistUser(null)
    notifyAuthChange()
    return null
  }
}

export async function updateUserProfile(payload) {
  try {
    const res = await api('/update-profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    const user = mapUser(res.user)
    persistUser(user)
    notifyAuthChange()
    return { ok: true, user }
  } catch (e) {
    return { ok: false, message: e.message || 'Profile update failed.' }
  }
}
