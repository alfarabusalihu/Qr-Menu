'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { usePanel } from '../../context/PanelContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductPanel = () => {
    const { selectedProduct } = usePanel();
    const { addToCart, getItemQuantity, updateQuantity, isLoaded } = useCart();
    const { goBack, goTo } = usePanel();

    if (!selectedProduct) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-400">No product selected</p>
            </div>
        );
    }

    const quantity = isLoaded ? getItemQuantity(selectedProduct.id) : 0;
    const isOutOfStock = selectedProduct.availableQty <= 0;

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addToCart(selectedProduct, 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < selectedProduct.availableQty) {
            updateQuantity(selectedProduct.id, quantity + 1);
        }
    };

    const handleDecrement = () => {
        updateQuantity(selectedProduct.id, quantity - 1);
    };

    return (
        <div className="min-h-screen">
            {/* Header with Back Button */}
            <header className="sticky top-0 z-20 bg-prussian-dark/95 backdrop-blur-sm border-b border-white/10">
                <div className="content-container py-4 flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className="text-xl font-bold text-white truncate">{selectedProduct.name}</h1>
                </div>
            </header>

            {/* Product Details */}
            <main className="content-container max-w-3xl">
                {/* Product Image */}
                <div className="relative rounded-2xl overflow-hidden mb-6">
                    <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-2xl font-bold text-red-400">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                    <p className="text-gray-400 mb-4">{selectedProduct.description}</p>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl font-bold text-yellow">Rs. {selectedProduct.price}</span>
                        <span className="text-gray-500">🕒 {selectedProduct.prepTime}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                        <span>Available: {selectedProduct.availableQty}</span>
                    </div>

                    {/* Add-ons Section */}
                    {selectedProduct.addons.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Available Add-ons</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedProduct.addons.map((addon, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-surface border border-white/10 rounded-full text-sm text-gray-300"
                                    >
                                        {addon}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Controls */}
                    {!isOutOfStock && (
                        <div className="flex items-center justify-between">
                            {quantity === 0 ? (
                                <button
                                    className="w-full btn-primary text-lg py-4"
                                    onClick={handleAddToCart}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add to Cart
                                </button>
                            ) : (
                                <div className="w-full flex items-center justify-between bg-surface rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="w-12 h-12 rounded-full bg-gray text-black flex items-center justify-center hover:bg-gray-dark transition text-lg"
                                            onClick={handleDecrement}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <span className="text-2xl font-bold text-white min-w-[40px] text-center">{quantity}</span>
                                        <button
                                            className="w-12 h-12 rounded-full bg-yellow text-black flex items-center justify-center hover:bg-yellow-dark transition text-lg disabled:opacity-50"
                                            onClick={handleIncrement}
                                            disabled={quantity >= selectedProduct.availableQty}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <span className="text-xl font-bold text-yellow">
                                        Rs. {selectedProduct.price * quantity}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom actions */}
                {quantity > 0 && (
                    <div className="mt-6 flex gap-4">
                        <button
                            className="flex-1 btn-outline py-4"
                            onClick={goBack}
                        >
                            Continue Shopping
                        </button>
                        <button
                            className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
                            onClick={() => goTo('cart')}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} />
                            View Cart
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductPanel;
