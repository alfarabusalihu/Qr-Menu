'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { usePanel } from '../context/PanelContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHome, faUtensils, faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

interface NavbarProps {
    restaurantName: string;
}

const Navbar = ({ restaurantName }: NavbarProps) => {
    const { totalItems, isLoaded } = useCart();
    const { goTo, currentPanel } = usePanel();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex navbar-sidebar fixed left-0 top-0 h-screen w-64 flex-col justify-between p-6 z-40">
                {/* Top Section - Logo & Name */}
                <div>
                    <div className="mb-8">
                        <div className="w-14 h-14 rounded-full bg-yellow/20 flex items-center justify-center mb-3">
                            <FontAwesomeIcon icon={faUtensils} className="text-xl text-yellow" />
                        </div>
                        <h1 className="text-xl font-bold text-white">{restaurantName}</h1>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-2">
                        <button
                            onClick={() => goTo('menu')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${currentPanel === 'menu' ? 'bg-yellow text-black' : 'text-white hover:bg-white/10'
                                }`}
                        >
                            <FontAwesomeIcon icon={faHome} className="w-5" />
                            Menu
                        </button>
                        <button
                            onClick={() => goTo('cart')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 relative ${currentPanel === 'cart' ? 'bg-yellow text-black' : 'text-white hover:bg-white/10'
                                }`}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="w-5" />
                            Cart
                            {isLoaded && totalItems > 0 && (
                                <span className="ml-auto badge">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Bottom Section - Restaurant Info */}
                <div className="border-t border-white/10 pt-6">
                    <div className="space-y-3 text-sm text-gray-400">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-dark w-4" />
                            <span>123 Food Street, City</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faPhone} className="text-gray-dark w-4" />
                            <span>+94 123 456 789</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-dark w-4" />
                            <span>info@restaurant.com</span>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 mt-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                            className="text-gray-dark hover:text-white transition">
                            <FontAwesomeIcon icon={faFacebook} className="text-lg" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                            className="text-gray-dark hover:text-white transition">
                            <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                        </a>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden navbar-sidebar fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 z-50">
                <button
                    onClick={() => goTo('menu')}
                    className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition ${currentPanel === 'menu' ? 'text-yellow' : 'text-gray-dark'
                        }`}
                >
                    <FontAwesomeIcon icon={faHome} className="text-xl" />
                    <span className="text-xs font-medium">Menu</span>
                </button>
                <button
                    onClick={() => goTo('cart')}
                    className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition relative ${currentPanel === 'cart' ? 'text-yellow' : 'text-gray-dark'
                        }`}
                >
                    <div className="relative">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                        {isLoaded && totalItems > 0 && (
                            <span className="absolute -top-2 -right-3 badge text-[10px] min-w-[18px] h-[18px]">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium">Cart</span>
                </button>
            </nav>
        </>
    );
};

export default Navbar;
