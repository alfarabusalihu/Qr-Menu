'use client';

import React, { useEffect, useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { Order } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCopy, faHome } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const SuccessPanel = () => {
    const { goToMenu } = usePanel();
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
            <div className="flex items-center justify-center h-screen">
                <div className="text-yellow text-xl">Loading...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">No order found</p>
                    <button className="btn-primary" onClick={goToMenu}>
                        Go to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Success Header */}
            <div className="bg-gradient-to-b from-green-500/20 to-transparent pt-12 pb-8">
                <div className="content-container text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 animate-fade-in">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400">Your order has been placed successfully</p>
                </div>
            </div>

            <main className="content-container max-w-2xl">
                {/* Order ID Card */}
                <div className="card mb-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">Order Number</p>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-yellow">{order.id}</span>
                        <button
                            onClick={handleCopyOrderId}
                            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                    {copied && (
                        <p className="text-green-400 text-sm animate-fade-in">Copied to clipboard!</p>
                    )}
                    <p className="text-gray-500 text-sm">
                        Save this number to add more items to your order
                    </p>
                </div>

                {/* Customer Details */}
                <div className="card mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Customer Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Name</span>
                            <span className="text-white font-medium">{order.userDetails.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Phone</span>
                            <span className="text-white font-medium">{order.userDetails.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Email</span>
                            <span className="text-white font-medium">{order.userDetails.email}</span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="card mb-6">
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

                    <div className="border-t border-white/10 mt-4 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-white">Total</span>
                            <span className="text-2xl font-bold text-yellow">Rs. {order.total}</span>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Share */}
                <button
                    onClick={handleWhatsAppShare}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition mb-4"
                >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                    Share via WhatsApp
                </button>

                {/* Back to Menu */}
                <button
                    onClick={goToMenu}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-3"
                >
                    <FontAwesomeIcon icon={faHome} />
                    Order More
                </button>
            </main>
        </div>
    );
};

export default SuccessPanel;
