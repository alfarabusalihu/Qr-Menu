'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import LayoutWrapper from '@/components/LayoutWrapper';
import CartItemRow from '@/components/CartItemRow';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';

export default function CartPage() {
    const router = useRouter();
    const { cart, getCartTotal } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <LayoutWrapper>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-yellow text-xl">Loading...</div>
                </div>
            </LayoutWrapper>
        );
    }

    const { totalItems, totalPrice } = getCartTotal();
    const isEmpty = cart.length === 0;

    return (
        <LayoutWrapper>
            <div className="p-4 md:p-8 lg:p-8">
                {isEmpty ? (
                    <div className="text-center py-20 bg-surface/50 rounded-3xl border border-white/5 animate-in">
                        <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-white/20" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-yellow text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-dark transition shadow-lg shadow-yellow/10"
                        >
                            <Plus size={20} />
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <CartItemRow key={item.id} item={item} />
                            ))}

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-yellow text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-dark transition shadow-lg shadow-yellow/10"
                            >
                                <Plus size={20} />
                                Add More Items
                            </Link>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface rounded-3xl p-6 border border-white/10 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="text-white">$ {totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Taxes (0%)</span>
                                        <span className="text-white">$ 0</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-4"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-white">Total</span>
                                        <span className="text-2xl font-bold text-yellow">$ {totalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/order')}
                                    className="w-full bg-yellow hover:bg-yellow-dark text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow/10 hover:shadow-yellow/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                    <ArrowLeft size={20} className="rotate-180" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    );
}
