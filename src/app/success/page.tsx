'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/services/api';
import LayoutWrapper from '@/components/LayoutWrapper';
import { CheckCircle, Copy, Home, Share2, User, Phone, Mail } from 'lucide-react';

export default function SuccessPage() {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedOrder = sessionStorage.getItem('lastOrder');
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
        }
    }, []);

    const handleCopyOrderId = async () => {
        if (order) {
            try {
                await navigator.clipboard.writeText(order.id);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handleWhatsAppShare = () => {
        if (!order) return;

        const message = encodeURIComponent(
            `🍽️ Order Confirmation\n\n` +
            `Order ID: ${order.id}\n` +
            `Name: ${order.userDetails.name}\n\n` +
            `Items:\n${order.items.map(item => `• ${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}`).join('\n')}\n\n` +
            `Total: Rs. ${order.total}\n\n` +
            `Thank you for your order!`
        );

        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    if (!mounted) {
        return (
            <LayoutWrapper>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-yellow text-xl">Loading...</div>
                </div>
            </LayoutWrapper>
        );
    }

    if (!order) {
        return (
            <LayoutWrapper>
                <div className="flex items-center justify-center p-20">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">No order found</p>
                        <Link href="/" className="btn-primary">
                            Go to Menu
                        </Link>
                    </div>
                </div>
            </LayoutWrapper>
        );
    }

    return (
        <LayoutWrapper>
            {/* Success Header */}
            <div className="bg-gradient-to-b from-green-500/20 to-transparent pt-12 pb-8">
                <div className="text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 animate-in">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400">Your order has been placed successfully</p>
                </div>
            </div>

            <div className="animate-in max-w-2xl mx-auto">
                {/* Order ID Card */}
                <div className="card p-7 mb-8 text-center">
                    <p className="text-gray-400 text-sm mb-2">Order Number</p>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-yellow">{order.id}</span>
                        <button
                            onClick={handleCopyOrderId}
                            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                    {copied && (
                        <p className="text-green-400 text-sm animate-in mb-2">Copied to clipboard!</p>
                    )}
                    <p className="text-gray-500 text-sm">
                        Save this number to add more items to your order
                    </p>
                </div>

                {/* Customer Details */}
                <div className="card p-7 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Customer Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Name</p>
                                <p className="text-white font-medium">{order.userDetails.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Phone</p>
                                <p className="text-white font-medium">{order.userDetails.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email</p>
                                <p className="text-white font-medium">{order.userDetails.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="card p-7 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-yellow/20 text-yellow text-xs flex items-center justify-center font-bold">
                                        {item.quantity}
                                    </span>
                                    <span className="text-white">{item.name}</span>
                                </div>
                                <span className="text-yellow font-medium">Rs. {item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 mt-6 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-white">Total</span>
                            <span className="text-2xl font-bold text-yellow">Rs. {order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="btn-primary w-full py-4 text-lg"
                    >
                        <Home size={20} />
                        Order More
                    </Link>
                </div>
            </div>
        </LayoutWrapper>
    );
}
