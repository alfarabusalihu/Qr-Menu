'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, cartService } from '../services/api';

interface CartContextType {
    items: CartItem[];
    addToCart: (item: MenuItem, quantity?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (itemId: string) => number;
    totalItems: number;
    totalPrice: number;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount - only on client
    useEffect(() => {
        const savedCart = cartService.getCart();
        setItems(savedCart);
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            cartService.saveCart(items);
        }
    }, [items, isLoaded]);

    const addToCart = (item: MenuItem, quantity: number = 1) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(i => i.id === item.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, { ...item, quantity }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setItems(prev => prev.map(i =>
            i.id === itemId ? { ...i, quantity } : i
        ));
    };

    const clearCart = () => {
        setItems([]);
        cartService.clearCart();
    };

    const getItemQuantity = (itemId: string): number => {
        const item = items.find(i => i.id === itemId);
        return item?.quantity || 0;
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getItemQuantity,
            totalItems,
            totalPrice,
            isLoaded,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
