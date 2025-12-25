import { create } from 'zustand';
import { apiClient } from '../api/api.js';

export const useBidsStore = create((set, get) => ({
  itemBids: {},
  myBids: [],
  isLoading: false,
  error: null,

  fetchItemBids: async (itemId) => {
    try {
      set({ isLoading: true, error: null });
      const bids = await apiClient.getItemBids(itemId);
      const currentItemBids = get().itemBids;
      set({ 
        itemBids: { ...currentItemBids, [itemId]: bids },
        isLoading: false 
      });
      return bids;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createBid: async (itemId, bidData) => {
    try {
      set({ isLoading: true, error: null });
      const newBid = await apiClient.createBid(itemId, bidData);
      const currentItemBids = get().itemBids;
      const itemBids = currentItemBids[itemId] || [];
      set({ 
        itemBids: { 
          ...currentItemBids, 
          [itemId]: [newBid, ...itemBids] 
        },
        isLoading: false 
      });
      
      return newBid;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchMyBids: async () => {
    try {
      set({ isLoading: true, error: null });
      const myBids = await apiClient.getMyBids();
      set({ myBids, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));