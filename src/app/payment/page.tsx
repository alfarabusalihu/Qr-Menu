'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

function PaymentContent() {
    const router = useRouter();
    const order = useStore((state) => state.order);
    const setOrder = useStore((state) => state.setOrder);

    // Optional: We can still check URL param if we want, but store is source of truth
    // If order in store is null or doesn't match what we expect, redirect?
    // For simplicity, we just check if we have an order in store.
    const [processing, setProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!order) {
            router.push('/order');
        }
    }, [order, router]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate network delay
        setTimeout(() => {
            // Update local order status
            if (order) {
                const updatedOrder = { ...order, paymentStatus: 'paid' as const, status: 'completed' as const };
                setOrder(updatedOrder);
            }
            setProcessing(false);
            router.push('/success');
        }, 2000);
    };

    if (!mounted || !order) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-white">Loading payment session...</div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl animate-in">

                {/* Header */}
                <div className="bg-prussian-dark p-6 text-center border-b border-gray-100/10">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-white text-xl font-bold">Checkout</h2>
                    <p className="text-gray-400 text-sm">Secured by Stripe</p>
                </div>

                {/* Amount */}
                <div className="p-8 text-center bg-gray-50 border-b border-gray-200">
                    <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">Total Amount</p>
                    <p className="text-4xl font-extrabold text-prussian-dark">$ {order.total}</p>
                </div>

                {/* Mock Card Form */}
                <form onSubmit={handlePayment} className="p-8 space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Card Information</label>
                            <div className="border border-gray-300 rounded-lg p-3 flex items-center bg-white gap-3 focus-within:ring-2 focus-within:ring-prussian focus-within:border-prussian transition-all">
                                <CreditCard className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 font-mono"
                                    maxLength={19}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-prussian transition-all">
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        className="w-full outline-none text-gray-800 placeholder:text-gray-300 text-center font-mono"
                                        maxLength={5}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-prussian transition-all flex items-center gap-2">
                                    <Lock size={14} className="text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        className="w-full outline-none text-gray-800 placeholder:text-gray-300 text-center font-mono"
                                        maxLength={3}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name on Card</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none text-gray-800 focus:ring-2 focus:ring-prussian transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-prussian text-white font-bold py-4 rounded-xl shadow-lg hover:bg-prussian-light transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>Pay $ {order.total}</span>
                                <Lock size={16} />
                            </>
                        )}
                    </button>

                    <div className="text-center text-xs text-gray-400 mt-4">
                        Runs in test mode. No actual money is charged.
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <LayoutWrapper pageTitle="Secure Payment" backUrl="/order">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-white">Loading payment interface...</div>
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </LayoutWrapper>
    );
}
