export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    jobTitle?: 'chef' | 'waiter' | 'manager';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    sessionId: string;
    tableId: string;
    total: number;
    status: 'pending' | 'preparing' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
    items: OrderItem[];
    userDetails: {
        name: string;
        phone: string;
    };
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    availableQty: number; // Daily stock
    isAvailable: boolean; // Manual toggle
    image: string;
    prepTime?: string;
    categoryId?: string; // Optional for now
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    jobTitle?: string;
    isActive: boolean;
}
