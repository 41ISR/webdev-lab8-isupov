import { create } from 'zustand';
import { apiClient } from '../api/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: async () => {
    const token = apiClient.getAuthToken();
    if (token) {
      try {
        set({ isLoading: true });
        const user = await apiClient.getCurrentUser();
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        apiClient.removeAuthToken();
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.login(credentials);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.register(userData);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    apiClient.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  clearError: () => set({ error: null }),
}));