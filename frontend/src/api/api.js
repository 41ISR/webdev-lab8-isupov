const API_URL = 'https://kitek.ktkv.dev/marketplace/'

async function handleResponse(response) {
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.error || data?.message || 'Request failed'
    throw new Error(message)
  }

  return data
}

const authHeader = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}

export const api = {
  register: async ({ username, password, email }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    })
    return handleResponse(res)
  },

  login: async ({ username, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return handleResponse(res)
  },

  me: async (token) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        ...authHeader(token),
      },
    })
    return handleResponse(res)
  },

  getItems: async () => {
    const res = await fetch(`${API_URL}/items`)
    return handleResponse(res)
  },

  createItem: async (itemData, token) => {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: JSON.stringify(itemData),
    })
    return handleResponse(res)
  },

  deleteItem: async (id, token) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(token),
      },
    })
    return handleResponse(res)
  },

  getItemBids: async (itemId) => {
    const res = await fetch(`${API_URL}/items/${itemId}/bids`)
    return handleResponse(res)
  },

  createBid: async (itemId, bidData, token) => {
    const res = await fetch(`${API_URL}/items/${itemId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(token),
      },
      body: JSON.stringify(bidData),
    })
    return handleResponse(res)
  },

  getMyBids: async (token) => {
    const res = await fetch(`${API_URL}/bids/my`, {
      headers: {
        ...authHeader(token),
      },
    })
    return handleResponse(res)
  },

  getStats: async () => {
    const res = await fetch(`${API_URL}/stats`)
    return handleResponse(res)
  },
}