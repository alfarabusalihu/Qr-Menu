'use client';

import React from 'react';
import { CartItem } from '../services/api';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface CartItemRowProps {
    item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
    const { updateQuantity, removeFromCart } = useCart();

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
        <div className="card animate-fade-in">
            <div className="flex gap-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />

                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="text-base md:text-lg font-bold text-white truncate pr-2">{item.name}</h3>
                        <button
                            className="text-gray-dark hover:text-red-400 transition p-1"
                            onClick={handleRemove}
                            aria-label="Remove item"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-surface rounded-lg px-2 py-1">
                            <button
                                className="w-7 h-7 rounded-full bg-gray text-black flex items-center justify-center hover:bg-gray-dark transition"
                                onClick={handleDecrement}
                            >
                                <FontAwesomeIcon icon={faMinus} className="text-xs" />
                            </button>
                            <span className="text-white font-bold min-w-[24px] text-center">{item.quantity}</span>
                            <button
                                className="w-7 h-7 rounded-full bg-yellow text-black flex items-center justify-center hover:bg-yellow-dark transition disabled:opacity-50"
                                onClick={handleIncrement}
                                disabled={item.quantity >= item.availableQty}
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                            </button>
                        </div>

                        <p className="text-lg md:text-xl font-bold text-yellow">Rs. {itemTotal}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemRow;
