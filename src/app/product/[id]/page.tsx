'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { menuService, MenuItem } from '@/services/api';
import { useStore } from '@/store/useStore';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, MessageSquare } from 'lucide-react';

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<MenuItem | null>(null);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Zustand hooks
    const addToCart = useStore((state) => state.addToCart);
    const cart = useStore((state) => state.cart);
    const [isLoaded, setIsLoaded] = useState(false);

    const productId = params.id as string;

    useEffect(() => {
        setIsLoaded(true);
        const loadProduct = async () => {
            const menuData = await menuService.getMenu();
            for (const category of menuData.categories) {
                const foundItem = category.items.find(item => item.id === productId);
                if (foundItem) {
                    setProduct(foundItem);
                    break;
                }
            }
        };
        loadProduct();
    }, [productId]);

    if (!product || !isLoaded) {
        return (
            <LayoutWrapper>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-yellow text-xl">Loading...</div>
                </div>
            </LayoutWrapper>
        );
    }

    const isOutOfStock = product.availableQty <= 0;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.availableQty) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addToCart(product, quantity);
            setQuantity(1);
            setSpecialInstructions('');
        }
    };

    return (
        <LayoutWrapper restaurantName="Product Details">
            <div className="p-6 md:p-10 lg:p-12">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                {/* Product Layout */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 animate-in">
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="sticky top-24">
                            <div className="aspect-square w-full rounded-3xl overflow-hidden bg-surface-light shadow-2xl relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {isOutOfStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-3xl font-bold text-red-400 border-4 border-red-400 px-6 py-2 rounded-xl -rotate-12">
                                            OUT OF STOCK
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 p-6 bg-surface-light/50 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-3 text-yellow">
                                <Clock size={24} />
                                <span className="font-semibold text-lg">{product.prepTime}</span>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div className="text-3xl font-bold text-white">
                                 {product.price}$
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/10">
                            {!isOutOfStock ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-medium">Quantity</span>
                                        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-white/10">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <span className="text-xl font-bold text-white w-12 text-center tabular-nums">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                className="w-10 h-10 rounded-lg bg-yellow hover:bg-yellow-dark text-black flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={quantity >= product.availableQty}
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-surface rounded-2xl p-4 border border-white/10 focus-within:border-yellow/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <MessageSquare size={20} className="text-gray-400 mt-1" />
                                            <textarea
                                                className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-sm resize-none p-0 leading-relaxed"
                                                placeholder="Add special instructions (e.g. less spicy)..."
                                                rows={3}
                                                value={specialInstructions}
                                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-yellow hover:bg-yellow-dark text-black text-lg font-bold py-4 rounded-xl shadow-lg shadow-yellow/10 hover:shadow-yellow/20 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                                    >
                                        <ShoppingCart size={24} />
                                        Add to Cart - {product.price * quantity}$
                                    </button>
                                </>
                            ) : (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                    <p className="text-red-400 font-medium">Currently unavailable</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}
