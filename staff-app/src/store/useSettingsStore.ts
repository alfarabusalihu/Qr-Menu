import { create } from 'zustand';
import api from '../services/api';
import { BusinessSettings } from '../types';

interface SettingsState {
    settings: BusinessSettings | null;
    isLoading: boolean;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: BusinessSettings) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isLoading: false,

    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get<BusinessSettings>('/settings');
            set({ settings: response.data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch settings', error);
            set({ isLoading: false });
        }
    },

    updateSettings: async (settings) => {
        set({ isLoading: true });
        try {
            await api.post('/settings', settings);
            set({ settings, isLoading: false });
        } catch (error) {
            console.error('Failed to update settings', error);
            set({ isLoading: false });
        }
    },
}));
