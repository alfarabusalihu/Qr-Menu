import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';

interface ThemeState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'dark',
    toggleTheme: async () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        await AsyncStorage.setItem('user-theme', newTheme);
    },
    loadTheme: async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user-theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                set({ theme: savedTheme });
            } else {
                // Default relative to system or just dark as per requirement
                set({ theme: 'dark' });
            }
        } catch (error) {
            console.error('Failed to load theme', error);
        }
    },
}));
