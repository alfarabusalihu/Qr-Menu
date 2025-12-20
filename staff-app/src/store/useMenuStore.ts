import { create } from 'zustand';
import api from '../services/api';
import { MenuItem } from '../types';

interface MenuState {
    items: MenuItem[];
    isLoading: boolean;
    error: string | null;
    fetchMenu: () => Promise<void>;
    toggleItemAvailability: (itemId: string) => Promise<void>;
    addProduct: (item: Partial<MenuItem>) => Promise<void>;
    updateProduct: (id: string, item: Partial<MenuItem>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchMenu: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<any>('/staff/menu');
            // Backend returns { categories: [{ items: [...] }] }
            const categories = response.data.categories || [];
            const allItems: MenuItem[] = [];
            categories.forEach((cat: any) => {
                cat.items.forEach((item: any) => {
                    // Include category info if needed
                    allItems.push({ ...item, categoryId: cat.id });
                });
            });
            set({ items: allItems, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    toggleItemAvailability: async (itemId) => {
        try {
            // Optimistic update
            set(state => ({
                items: state.items.map(i => i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i)
            }));

            await api.put(`/staff/menu/${itemId}/toggle`);
        } catch (error: any) {
            // Revert
            get().fetchMenu();
        }
    },

    addProduct: async (item) => {
        set({ isLoading: true });
        try {
            await api.post('/products', item);
            get().fetchMenu();
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
            throw e;
        }
    },

    updateProduct: async (id, item) => {
        set({ isLoading: true });
        try {
            await api.put(`/products/${id}`, item);
            get().fetchMenu();
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
            throw e;
        }
    },

    deleteProduct: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/products/${id}`);
            get().fetchMenu(); // Refresh list
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
}));
