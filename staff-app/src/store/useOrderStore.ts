import { create } from 'zustand';
import api from '../services/api';
import { Order } from '../types';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<Order[]>('/staff/orders');
            set({ orders: response.data || [], isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            set(state => ({
                orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
            }));

            await api.put(`/orders/${id}/status`, { status });
        } catch (error: any) {
            get().fetchOrders();
        }
    },
}));
```
