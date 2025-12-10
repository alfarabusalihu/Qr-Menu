'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { usePanel } from '../../context/PanelContext';
import { orderService, Order } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPhone, faEnvelope, faReceipt } from '@fortawesome/free-solid-svg-icons';

const OrderPanel = () => {
    const { items, totalPrice, clearCart, isLoaded } = useCart();
    const { goBack, goTo } = usePanel();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [existingOrderId, setExistingOrderId] = useState('');
    const [existingOrder, setExistingOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'new' | 'existing'>('new');

    const handleLookupOrder = () => {
        if (!existingOrderId.trim()) {
            setError('Please enter an order ID');
            return;
        }

        const order = orderService.getOrderById(existingOrderId.trim().toUpperCase());
        if (order) {
            setExistingOrder(order);
            setName(order.userDetails.name);
            setPhone(order.userDetails.phone);
            setEmail(order.userDetails.email);
            setError('');
        } else {
            setError('Order not found. Please check the ID and try again.');
            setExistingOrder(null);
        }
    };

    const validateForm = (): boolean => {
        if (!name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!phone.trim() || phone.length < 10) {
            setError('Please enter a valid phone number');
            return false;
        }
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        return true;
    };

    const handleSubmitOrder = async () => {
        if (!validateForm()) return;
        if (items.length === 0 && !existingOrder) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let order: Order | null;

            if (mode === 'existing' && existingOrder) {
                order = orderService.addToExistingOrder(existingOrder.id, items);
            } else {
                order = orderService.createOrder(items, { name, phone, email });
            }

            if (order) {
                clearCart();
                sessionStorage.setItem('lastOrder', JSON.stringify(order));
                goTo('success');
            } else {
                setError('Failed to create order. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const combinedTotal = existingOrder
        ? existingOrder.total + totalPrice
        : totalPrice;

    const combinedItems = existingOrder
        ? [...existingOrder.items, ...items]
        : items;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-prussian-dark/95 backdrop-blur-sm border-b border-white/10">
                <div className="content-container py-4 flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className="text-xl font-bold text-white">Your Details</h1>
                </div>
            </header>

            <main className="content-container">
                <div className="two-column">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                        {/* Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${mode === 'new'
                                        ? 'bg-yellow text-black'
                                        : 'bg-surface-light text-gray-400 hover:text-white'
                                    }`}
                                onClick={() => {
                                    setMode('new');
                                    setExistingOrder(null);
                                    setName('');
                                    setPhone('');
                                    setEmail('');
                                }}
                            >
                                New Order
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${mode === 'existing'
                                        ? 'bg-yellow text-black'
                                        : 'bg-surface-light text-gray-400 hover:text-white'
                                    }`}
                                onClick={() => setMode('existing')}
                            >
                                Add to Existing
                            </button>
                        </div>

                        {/* Existing Order Lookup */}
                        {mode === 'existing' && (
                            <div className="card">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faReceipt} className="text-yellow" />
                                    Enter Previous Order ID
                                </h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="e.g. ORD-XXXXX-XXX"
                                        value={existingOrderId}
                                        onChange={(e) => setExistingOrderId(e.target.value.toUpperCase())}
                                        className="input-field !pl-4"
                                    />
                                    <button
                                        className="btn-secondary px-6 whitespace-nowrap"
                                        onClick={handleLookupOrder}
                                    >
                                        Lookup
                                    </button>
                                </div>
                                {existingOrder && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <p className="text-green-400 font-semibold">✓ Order found!</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Previous items: {existingOrder.items.length} | Total: Rs. {existingOrder.total}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Details Form */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>

                            <div className="space-y-4">
                                <div className="input-wrapper">
                                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field"
                                        disabled={mode === 'existing' && !!existingOrder}
                                    />
                                </div>

                                <div className="input-wrapper">
                                    <FontAwesomeIcon icon={faPhone} className="input-icon" />
                                    <input
                                        type="tel"
                                        placeholder="WhatsApp Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input-field"
                                        disabled={mode === 'existing' && !!existingOrder}
                                    />
                                </div>

                                <div className="input-wrapper">
                                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field"
                                        disabled={mode === 'existing' && !!existingOrder}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Mobile: Place Order button */}
                        <button
                            className="w-full btn-primary py-4 text-lg lg:hidden disabled:opacity-50"
                            onClick={handleSubmitOrder}
                            disabled={loading || (!isLoaded || (items.length === 0 && !existingOrder))}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>

                    {/* Right Column - Order Preview (Sticky) */}
                    <div className="sticky-summary">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Order Preview</h3>

                            {isLoaded && combinedItems.length > 0 ? (
                                <>
                                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                        {combinedItems.map((item, idx) => (
                                            <div key={`${item.id}-${idx}`} className="flex justify-between text-sm">
                                                <span className="text-gray-400">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="text-white">Rs. {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/10 pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-white">Total</span>
                                            <span className="text-2xl font-bold text-yellow">Rs. {combinedTotal}</span>
                                        </div>
                                    </div>

                                    {/* Desktop: Place Order button */}
                                    <button
                                        className="w-full btn-primary py-4 text-lg hidden lg:block disabled:opacity-50"
                                        onClick={handleSubmitOrder}
                                        disabled={loading || (!isLoaded || (items.length === 0 && !existingOrder))}
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-400">No items in cart</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderPanel;
