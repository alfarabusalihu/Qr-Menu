'use client';

import React, { useEffect, useState } from 'react';
import { menuService, MenuData } from '@/services/api';
import { useCart } from '@/context/CartContext';
import LayoutWrapper from '@/components/LayoutWrapper';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import MenuItemCard from '@/components/MenuItemCard';

export default function HomePage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const { totalItems, totalPrice, isLoaded } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      const data = await menuService.getMenu();
      setMenuData(data);
    };
    loadMenu();
  }, []);

  if (!menuData) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-yellow text-xl">Loading menu...</div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper restaurantName={menuData.restaurantName}>
      {/* Header */}
      <div className="header-bar">
        <div className="header-content">
          <h1 className="md:hidden text-xl font-bold text-white flex-1 text-center">
            {menuData.restaurantName}
          </h1>
        </div>

        {/* Categories */}
        <div className="header-content mt-3">
          <div className="flex gap-2 flex-wrap justify-center w-full">
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
        </div>
      </div>

      {/* Menu Content */}
      <div className="space-y-12 p-6 md:p-10 lg:p-12">
        {menuData?.categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Floating Cart Button */}
      {isLoaded && totalItems > 0 && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-30">
          <Link
            href="/cart"
            className="btn-primary py-4 px-6 text-lg shadow-lg"
          >
            <ShoppingCart size={20} />
            <span className="font-bold">{totalItems} items</span>
            <span className="font-bold">• Rs. {totalPrice}</span>
          </Link>
        </div>
      )}
    </LayoutWrapper>
  );
}
