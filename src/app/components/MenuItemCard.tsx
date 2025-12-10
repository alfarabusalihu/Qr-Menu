'use client';

import React from 'react';
import { MenuItem } from '../services/api';
import { useCart } from '../context/CartContext';
import { usePanel } from '../context/PanelContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
    const { addToCart, getItemQuantity, updateQuantity, isLoaded } = useCart();
    const { goToProduct } = usePanel();

    const quantity = isLoaded ? getItemQuantity(item.id) : 0;
    const isOutOfStock = item.availableQty <= 0;

    const handleCardClick = () => {
        if (!isOutOfStock) {
            goToProduct(item);
        }
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOutOfStock) {
            addToCart(item, 1);
        }
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity < item.availableQty) {
            updateQuantity(item.id, quantity + 1);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateQuantity(item.id, quantity - 1);
    };

    return (
        <div
            className={`card cursor-pointer relative ${isOutOfStock ? 'opacity-50' : ''}`}
            onClick={handleCardClick}
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
                            <p className="text-lg md:text-xl font-bold text-yellow">Rs. {item.price}</p>
                            <p className="text-xs text-gray-500">🕒 {item.prepTime}</p>
                        </div>

                        {!isOutOfStock && isLoaded && (
                            quantity === 0 ? (
                                <button
                                    className="bg-yellow text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-dark transition"
                                    onClick={handleAddClick}
                                >
                                    + Add
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 bg-surface rounded-lg px-2 py-1">
                                    <button
                                        className="w-8 h-8 rounded-full bg-gray text-black flex items-center justify-center hover:bg-gray-dark transition"
                                        onClick={handleDecrement}
                                    >
                                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                    </button>
                                    <span className="text-white font-bold min-w-[24px] text-center">{quantity}</span>
                                    <button
                                        className="w-8 h-8 rounded-full bg-yellow text-black flex items-center justify-center hover:bg-yellow-dark transition"
                                        onClick={handleIncrement}
                                        disabled={quantity >= item.availableQty}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                    </button>
                                </div>
                            )
                        )}

                        {!isOutOfStock && !isLoaded && (
                            <button className="bg-gray text-black text-sm font-semibold px-4 py-2 rounded-lg opacity-50" disabled>
                                + Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
