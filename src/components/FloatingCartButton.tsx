'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function FloatingCartButton() {
    const { getCartTotal } = useStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const { totalItems, totalPrice } = getCartTotal();

    if (totalItems === 0) return null;

    return (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-30">
            <Link
                href="/cart"
                className="btn-primary py-4 px-6 text-lg shadow-lg flex items-center gap-2"
            >
                <ShoppingCart size={20} />
                <span className="font-bold">{totalItems} items</span>
                <span className="font-bold">• $ {totalPrice}</span>
            </Link>
        </div>
    );
}
