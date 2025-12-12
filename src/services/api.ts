// Service layer - easily swap between localStorage (demo) and real API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || null;

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

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    userDetails: UserDetails;
    status: 'pending' | 'preparing' | 'completed' | 'cancelled';
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
        if (API_BASE) {
            const response = await fetch(`${API_BASE}/menu`);
            return response.json();
        }
        const data = require('../app/data.json');
        return data as MenuData;
    },
};

// Cart Service (localStorage)
const CART_KEY = 'restaurant_cart';
const USER_ID_KEY = 'restaurant_user_id';

export const cartService = {
    getUserId: (): string => {
        if (typeof window === 'undefined') return '';
        let userId = localStorage.getItem(USER_ID_KEY);
        if (!userId) {
            userId = `USER-${generateId()}`;
            localStorage.setItem(USER_ID_KEY, userId);
        }
        return userId;
    },

    getCart: (): CartItem[] => {
        if (typeof window === 'undefined') return [];
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart: (items: CartItem[]): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    },

    clearCart: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(CART_KEY);
    },
};

// Order Service
const ORDERS_KEY = 'restaurant_orders';
const CURRENT_ORDER_KEY = 'restaurant_current_order';

export const orderService = {
    getOrders: (): Order[] => {
        if (typeof window === 'undefined') return [];
        const orders = localStorage.getItem(ORDERS_KEY);
        return orders ? JSON.parse(orders) : [];
    },

    getOrderById: (orderId: string): Order | null => {
        const orders = orderService.getOrders();
        return orders.find(o => o.id === orderId) || null;
    },

    createOrder: (items: CartItem[], userDetails: UserDetails): Order => {
        const userId = cartService.getUserId();
        const order: Order = {
            id: generateOrderId(),
            userId,
            items,
            userDetails,
            status: 'pending',
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            createdAt: new Date().toISOString(),
        };

        const orders = orderService.getOrders();
        orders.push(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        localStorage.setItem(CURRENT_ORDER_KEY, order.id);

        return order;
    },

    addToExistingOrder: (orderId: string, newItems: CartItem[]): Order | null => {
        const orders = orderService.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) return null;

        const order = orders[orderIndex];

        // Merge items
        newItems.forEach(newItem => {
            const existingIndex = order.items.findIndex(i => i.id === newItem.id);
            if (existingIndex >= 0) {
                order.items[existingIndex].quantity += newItem.quantity;
            } else {
                order.items.push(newItem);
            }
        });

        order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orders[orderIndex] = order;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        return order;
    },

    getCurrentOrderId: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(CURRENT_ORDER_KEY);
    },

    clearCurrentOrder: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(CURRENT_ORDER_KEY);
    },
};
