const API_BASE_URL = 'http://147.45.213.18:6789';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async register(userData) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  logout() {
    this.removeAuthToken();
  }

  async getItems() {
    return this.request('/api/items');
  }

  async createItem(itemData) {
    return this.request('/api/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(itemId) {
    return this.request(`/api/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async getItemBids(itemId) {
    return this.request(`/api/items/${itemId}/bids`);
  }

  async createBid(itemId, bidData) {
    return this.request(`/api/items/${itemId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  async getMyBids() {
    return this.request('/api/bids/my');
  }

  async getStats() {
    return this.request('/api/stats');
  }
}

export const apiClient = new ApiClient();