import { create } from 'zustand';
import { apiClient } from '../api/api.js';

export const useItemsStore = create((set, get) => ({
  items: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const items = await apiClient.getItems();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await apiClient.getStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  createItem: async (itemData) => {
    try {
      set({ isLoading: true, error: null });
      const newItem = await apiClient.createItem(itemData);
      const currentItems = get().items;
      set({ 
        items: [newItem, ...currentItems], 
        isLoading: false 
      });
      return newItem;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteItem: async (itemId) => {
    try {
      await apiClient.deleteItem(itemId);
      const currentItems = get().items;
      set({ 
        items: currentItems.filter(item => item.id !== itemId) 
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));