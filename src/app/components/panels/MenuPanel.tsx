'use client';

import React from 'react';
import { MenuData } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { usePanel } from '../../context/PanelContext';
import MenuItemCard from '../MenuItemCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

interface MenuPanelProps {
    menuData: MenuData | null;
}

const MenuPanel = ({ menuData }: MenuPanelProps) => {
    const { totalItems, totalPrice, isLoaded } = useCart();
    const { goTo } = usePanel();

    if (!menuData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-yellow text-xl">Loading menu...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-prussian-dark/95 backdrop-blur-sm border-b border-white/10">
                <div className="content-container py-4">
                    {/* Mobile: Show restaurant name */}
                    <h1 className="md:hidden text-2xl font-bold text-center text-white mb-4">
                        {menuData.restaurantName}
                    </h1>

                    {/* Category Nav */}
                    <nav className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-2 pb-2">
                            {menuData.categories.map((cat) => (
                                <a
                                    key={cat.id}
                                    href={`#${cat.id}`}
                                    className="category-pill"
                                >
                                    {cat.name}
                                </a>
                            ))}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Menu Content */}
            <main className="content-container">
                {menuData.categories.map((cat) => (
                    <section key={cat.id} id={cat.id} className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {cat.name}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {cat.items.map((item) => (
                                <MenuItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {/* Floating Cart Button - Only show when items in cart */}
            {isLoaded && totalItems > 0 && (
                <div className="fixed bottom-20 md:bottom-6 left-4 md:left-72 right-4 z-30">
                    <div className="max-w-xl mx-auto">
                        <button
                            className="w-full btn-primary flex items-center justify-between py-4 px-6 text-lg shadow-lg"
                            onClick={() => goTo('cart')}
                        >
                            <span className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faShoppingCart} />
                                <span className="font-bold">{totalItems} items</span>
                            </span>
                            <span className="font-bold">Rs. {totalPrice} →</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPanel;
