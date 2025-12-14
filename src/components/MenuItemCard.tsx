'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/services/api';
import { useStore } from '@/store/useStore';
import { Plus, Minus } from 'lucide-react';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
    const { addToCart, updateQuantity } = useStore();
    const quantity = useStore((state) => state.cart.find((i) => i.id === item.id)?.quantity || 0);

    // Hydration check
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => setIsLoaded(true), []);

    const isOutOfStock = item.availableQty <= 0;

    const handleAddClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
            addToCart(item, 1);
        }
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity < item.availableQty) {
            updateQuantity(item.id, quantity + 1);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(item.id, quantity - 1);
    };

    return (
        <Link
            href={isOutOfStock ? '#' : `/product/${item.id}`}
            className={`card block p-6 h-full hover:border-yellow/30 transition-all ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isOutOfStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Out of Stock
                </div>
            )}

            <div className="flex gap-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0"
                />

                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-white truncate">{item.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <p className="text-lg md:text-xl font-bold text-yellow">$ {item.price}</p>
                            <p className="text-xs text-gray-500">🕒 {item.prepTime}</p>
                        </div>

                        {!isOutOfStock && isLoaded && (
                            quantity === 0 ? (
                                <button
                                    className="bg-yellow text-black text-sm font-semibold px-6 py-3 rounded-lg hover:bg-yellow-dark transition flex items-center gap-1"
                                    onClick={handleAddClick}
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 bg-surface rounded-lg px-2 py-1" onClick={e => e.preventDefault()}>
                                    <button
                                        className="w-8 h-8 rounded-full bg-gray text-black flex items-center justify-center hover:bg-gray-dark transition"
                                        onClick={handleDecrement}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-white font-bold min-w-[24px] text-center">{quantity}</span>
                                    <button
                                        className="w-8 h-8 rounded-full bg-yellow text-black flex items-center justify-center hover:bg-yellow-dark transition"
                                        onClick={handleIncrement}
                                        disabled={quantity >= item.availableQty}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MenuItemCard;
