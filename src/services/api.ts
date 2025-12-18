// Service layer
const API_BASE = 'http://localhost:8080/api';

// Types
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    prepTime: string;
    image: string;
    availableQty: number;
    addons: string[];
}

export interface Category {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface MenuData {
    restaurantName: string;
    categories: Category[];
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface UserDetails {
    name: string;
    phone: string;
    email: string;
}

export type PaymentMethod = 'cash' | 'stripe';

export interface Order {
    id: string;
    sessionId: string;
    items: CartItem[];
    userDetails: UserDetails;
    status: 'pending' | 'preparing' | 'completed' | 'cancelled';
    paymentMethod: PaymentMethod;
    paymentStatus: 'pending' | 'paid' | 'failed';
    total: number;
    createdAt: string;
}

// Generate unique IDs
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
};

export const generateOrderId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};

// Menu Service
export const menuService = {
    getMenu: async (): Promise<MenuData> => {
        try {
            const response = await fetch(`${API_BASE}/menu`, {
                // Next.js extension for caching - revalidate every 60 seconds is handled in the page component usually,
                // but for simple fetch we can just do standard fetch.
                // If using in Server Component, we can pass cache options.
                next: { revalidate: 60 }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch menu');
            }
            const data = await response.json();
            if (!data || !data.categories) {
                console.warn('Backend returned incomplete data, using fallback');
                return { restaurantName: data?.restaurantName || 'Restaurant', categories: [] };
            }
            return data;
        } catch (error) {
            console.error("Error fetching menu:", error);
            // Fallback for dev if backend not ready, usually better to fail or handle gracefully
            // For build time, return empty structure to allow completion
            return { restaurantName: 'Menu (Offline)', categories: [] };
        }
    },
};

export const orderService = {
    submitOrder: async (order: Order): Promise<Order> => {
        try {
            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit order to backend');
            }
            return await response.json();
        } catch (error) {
            console.error("Error submitting order:", error);
            throw error;
        }
    },
};
