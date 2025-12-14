
import React from 'react';
import { menuService } from '@/services/api';
import LayoutWrapper from '@/components/LayoutWrapper';
import MenuItemCard from '@/components/MenuItemCard';
import FloatingCartButton from '@/components/FloatingCartButton';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const menuData = await menuService.getMenu();

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
            {(menuData.categories || []).map((cat) => (
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
        {(menuData.categories || []).map((category) => (
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
      <FloatingCartButton />
    </LayoutWrapper>
  );
}
