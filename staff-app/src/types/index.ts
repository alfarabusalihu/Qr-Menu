export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    jobTitle?: 'chef' | 'waiter' | 'manager';
    phone?: string;
    profileImage?: string;
    joinedAt?: string;
}

export interface BusinessSettings {
    id: string;
    businessName: string;
    currency: string;
    socials?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
}

export interface StaffStats {
    productCount: number;
    totalOrders: number;
    staffCount?: number;
    myOrders?: number;
    workingHours?: number;
}

export interface AuthResponse {
    token: string;
    staff: User;
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
    availableQty: number;
    isAvailable: boolean;
    image: string;
    prepTime?: string;
    categoryId?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    jobTitle?: string;
    isActive: boolean;
}
