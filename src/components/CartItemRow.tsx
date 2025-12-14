'use client';

import React from 'react';
import { CartItem } from '@/services/api';
import { useStore } from '@/store/useStore';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemRowProps {
    item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
    const { updateQuantity, removeFromCart } = useStore();

    const handleIncrement = () => {
        if (item.quantity < item.availableQty) {
            updateQuantity(item.id, item.quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    const handleRemove = () => {
        removeFromCart(item.id);
    };

    const itemTotal = item.price * item.quantity;

    return (
        <div className="card p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Image */}
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl flex-shrink-0"
            />

            {/* Name & Details */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{item.name}</h3>
                <p className="text-sm text-gray-400">$ {item.price} / item</p>
            </div>

            {/* Controls & Price - wrapped for mobile, row for desktop */}
            <div className="flex items-center justify-between sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0">
                {/* Quantity */}
                <div className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2 border border-white/5">
                    <button
                        className="w-8 h-8 rounded-full bg-gray text-black flex items-center justify-center hover:bg-gray-dark transition"
                        onClick={handleDecrement}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="text-white font-bold min-w-[24px] text-center">{item.quantity}</span>
                    <button
                        className="w-8 h-8 rounded-full bg-yellow text-black flex items-center justify-center hover:bg-yellow-dark transition disabled:opacity-50"
                        onClick={handleIncrement}
                        disabled={item.quantity >= item.availableQty}
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Price */}
                <div className="text-right min-w-[80px]">
                    <p className="text-lg sm:text-xl font-bold text-yellow">$ {itemTotal}</p>
                </div>

                {/* Delete */}
                <button
                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition ml-2"
                    onClick={handleRemove}
                    aria-label="Remove item"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default CartItemRow;
