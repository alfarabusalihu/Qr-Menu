'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { orderService, Order } from '@/services/api';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ArrowLeft, User, Phone, Mail, Receipt, Search } from 'lucide-react';

export default function OrderPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart, isLoaded } = useCart();

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
            setError('Order not found');
            setExistingOrder(null);
        }
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Please enter your name';
        if (!phone.trim() || phone.length < 10) newErrors.phone = 'Please enter a valid phone number';
        if (!email.trim() || !email.includes('@')) newErrors.email = 'Please enter a valid email';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitOrder = async () => {
        if (!validateForm()) return;
        if (items.length === 0 && !existingOrder) { setError('Cart is empty'); return; }

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
                router.push('/success');
            } else {
                setError('Failed to create order');
            }
        } catch {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const combinedTotal = existingOrder ? existingOrder.total + totalPrice : totalPrice;
    const combinedItems = existingOrder ? [...existingOrder.items, ...items] : items;
    const displayName = name || 'Your name';
    const displayPhone = phone || 'Phone number';
    const displayEmail = email || 'Email address';

    return (
        <LayoutWrapper pageTitle="Your Details" backUrl="/cart">

            <div className="animate-in p-6 md:p-10 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mode Toggle */}
                        <div className="flex gap-4">
                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${mode === 'new' ? 'bg-yellow text-black' : 'bg-surface-light text-gray-400'
                                    }`}
                                onClick={() => { setMode('new'); setExistingOrder(null); setName(''); setPhone(''); setEmail(''); setErrors({}); }}
                            >
                                New Order
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${mode === 'existing' ? 'bg-yellow text-black' : 'bg-surface-light text-gray-400'
                                    }`}
                                onClick={() => { setMode('existing'); setErrors({}); }}
                            >
                                Add to Existing
                            </button>
                        </div>

                        {/* Existing Order Lookup */}
                        {mode === 'existing' && (
                            <div className="card p-7">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Receipt size={18} className="text-yellow" />
                                    Enter Previous Order ID
                                </h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="e.g. ORD-XXXXX-XXX"
                                        value={existingOrderId}
                                        onChange={(e) => setExistingOrderId(e.target.value.toUpperCase())}
                                        className="input-field flex-1"
                                    />
                                    <button className="btn-secondary" onClick={handleLookupOrder}>
                                        <Search size={18} />
                                        Find
                                    </button>
                                </div>
                                {existingOrder && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <p className="text-green-400 font-semibold">✓ Order found!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contact Form */}
                        <div className="card p-7 space-y-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="input-group">
                                        <User size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                                            disabled={mode === 'existing' && !!existingOrder}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-400 text-sm mt-1 ml-2">{errors.name}</p>}
                                </div>

                                <div>
                                    <div className="input-group">
                                        <Phone size={18} className="input-icon" />
                                        <input
                                            type="tel"
                                            placeholder="WhatsApp Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                                            disabled={mode === 'existing' && !!existingOrder}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-400 text-sm mt-1 ml-2">{errors.phone}</p>}
                                </div>

                                <div>
                                    <div className="input-group">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                            disabled={mode === 'existing' && !!existingOrder}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-sm mt-1 ml-2">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Mobile submit */}
                        <button
                            className="btn-primary w-full py-4 text-lg lg:hidden disabled:opacity-50"
                            onClick={handleSubmitOrder}
                            disabled={loading || !isLoaded || (items.length === 0 && !existingOrder)}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>

                    {/* Right - Preview */}
                    <div className="lg:col-span-1">
                        <div className="card p-7 sticky-side">
                            <h3 className="text-lg font-semibold text-white mb-4">Order Preview</h3>

                            {/* User Preview */}
                            <div className="mb-4 p-3 bg-surface rounded-xl space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-gray-dark" />
                                    <span className={name ? 'text-white' : 'text-gray-500'}>{displayName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-gray-dark" />
                                    <span className={phone ? 'text-white' : 'text-gray-500'}>{displayPhone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-gray-dark" />
                                    <span className={email ? 'text-white' : 'text-gray-500'}>{displayEmail}</span>
                                </div>
                            </div>

                            {/* Items */}
                            {isLoaded && combinedItems.length > 0 ? (
                                <>
                                    <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                        {combinedItems.map((item, idx) => (
                                            <div key={`${item.id}-${idx}`} className="flex justify-between text-sm py-1">
                                                <span className="text-gray-400">{item.quantity}x {item.name}</span>
                                                <span className="text-white">Rs. {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/10 pt-6 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-white">Total</span>
                                            <span className="text-2xl font-bold text-yellow">Rs. {combinedTotal}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-primary w-full py-4 text-lg hidden lg:flex disabled:opacity-50"
                                        onClick={handleSubmitOrder}
                                        disabled={loading || !isLoaded || (items.length === 0 && !existingOrder)}
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
            </div>
        </LayoutWrapper>
    );
}
