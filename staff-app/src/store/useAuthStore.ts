import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,

    login: async (user, token) => {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        set({ user: null, token: null });
    },

    checkSession: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');

            if (token && userStr) {
                set({ token, user: JSON.parse(userStr), isLoading: false });
            } else {
                set({ token: null, user: null, isLoading: false });
            }
        } catch (e) {
            set({ token: null, user: null, isLoading: false });
        }
    },
}));
