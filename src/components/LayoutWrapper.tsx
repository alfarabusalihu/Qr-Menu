'use client';

import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Home, ShoppingCart, MapPin, Phone, Mail, ArrowLeft, Trash2 } from 'lucide-react';

interface LayoutWrapperProps {
    children: React.ReactNode;
    restaurantName?: string;
    pageTitle?: string;
    backUrl?: string;
}

const LayoutWrapper = ({ children, restaurantName = 'Restaurant', pageTitle, backUrl }: LayoutWrapperProps) => {
    const pathname = usePathname();
    const { totalItems, isLoaded, clearCart } = useCart();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-surface-light border-r border-white/10 flex-col justify-between p-8 z-40">


                {/* Top Section */}
                <div className="space-y-10">

                    {/* Logo + Name */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow/20 flex items-center justify-center">
                                <span className="text-2xl">🍽️</span>
                            </div>
                            <h1 className="text-lg font-bold text-white leading-tight">
                                {restaurantName}
                            </h1>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-3">
                        <Link
                            href="/"
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all ${isActive('/')
                                ? 'bg-yellow text-black shadow-lg shadow-yellow/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Home size={20} />
                            Menu
                        </Link>

                        <Link
                            href="/cart"
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all relative ${isActive('/cart')
                                ? 'bg-yellow text-black shadow-lg shadow-yellow/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <ShoppingCart size={20} />
                            Cart

                            {isLoaded && totalItems > 0 && (
                                <span className="ml-auto bg-black/20 text-current text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </nav>
                </div>

                {/* Bottom Contact Section */}
                <div className="border-t border-white/10 pt-8 space-y-5 text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                        <MapPin size={18} className="text-gray-500" />
                        <span>123 Food Street, City</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone size={18} className="text-gray-500" />
                        <span>+94 123 456 789</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail size={18} className="text-gray-500" />
                        <span>info@restaurant.com</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-white/10 flex justify-around items-center py-4 px-6 z-50 pb-safe">
                <Link
                    href="/"
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${isActive('/') ? 'text-yellow' : 'text-gray-500'
                        }`}
                >
                    <Home size={24} />
                    <span className="text-[10px] font-bold tracking-wide uppercase">Menu</span>
                </Link>

                <Link
                    href="/cart"
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors relative ${isActive('/cart') ? 'text-yellow' : 'text-gray-500'
                        }`}
                >
                    <div className="relative">
                        <ShoppingCart size={24} />
                        {isLoaded && totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold tracking-wide uppercase">Cart</span>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-72 min-h-screen pb-24 md:pb-0">
                <div className="max-w-7xl mx-auto">
                    {/* Conditional Header */}
                    {pathname === '/cart' ? (
                        <div className="flex items-center gap-4 mb-2 bg-surface p-6 border border-white/5 shadow-lg mx-4 md:mx-8 lg:mx-0 mt-0 md:mt-0 lg:mt-0">
                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Shopping Cart</h1>
                            {isLoaded && totalItems > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="ml-auto text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition"
                                >
                                    <Trash2 size={18} />
                                    <span className="hidden sm:inline">Clear Cart</span>
                                </button>
                            )}
                        </div>
                    ) : (pageTitle && (
                        <div className="flex items-center gap-4 mb-8 bg-surface p-6 border border-white/5 shadow-lg mx-4 md:mx-8 lg:mx-0 mt-0">
                            {backUrl && (
                                <Link
                                    href={backUrl}
                                    className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                            )}
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{pageTitle}</h1>
                        </div>
                    ))}

                    {children}
                </div>
            </main>
        </div>
    );
};

export default LayoutWrapper;
