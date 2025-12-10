'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { usePanel } from '../../context/PanelContext';
import CartItemRow from '../CartItemRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const CartPanel = () => {
    const { items, totalItems, totalPrice, clearCart, isLoaded } = useCart();
    const { goToMenu, goTo } = usePanel();

    const isEmpty = !isLoaded || items.length === 0;

    const handleProceedToOrder = () => {
        goTo('order');
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-prussian-dark/95 backdrop-blur-sm border-b border-white/10">
                <div className="content-container py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToMenu}
                            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <h1 className="text-xl font-bold text-white">Your Cart</h1>
                    </div>
                    {!isEmpty && (
                        <button
                            onClick={clearCart}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </header>

            <main className="content-container">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 rounded-full bg-surface-light flex items-center justify-center mb-6">
                            <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-white/30" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Add some delicious items to get started</p>
                        <button
                            className="btn-primary"
                            onClick={goToMenu}
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="two-column">
                        {/* Left Column - Cart Items */}
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                            </h2>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <CartItemRow key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Mobile: Add More button */}
                            <button
                                className="w-full btn-outline mt-4 lg:hidden"
                                onClick={goToMenu}
                            >
                                + Add More Items
                            </button>
                        </div>

                        {/* Right Column - Order Summary (Sticky) */}
                        <div className="sticky-summary">
                            <div className="card">
                                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white">Rs. {totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Service charge</span>
                                        <span className="text-white">Rs. 0</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-white">Total</span>
                                        <span className="text-2xl font-bold text-yellow">Rs. {totalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full btn-primary py-4 text-lg font-bold"
                                    onClick={handleProceedToOrder}
                                >
                                    Confirm Order →
                                </button>

                                {/* Desktop: Add More button */}
                                <button
                                    className="w-full btn-outline mt-3 hidden lg:block"
                                    onClick={goToMenu}
                                >
                                    + Add More Items
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPanel;
