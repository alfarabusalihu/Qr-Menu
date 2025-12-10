'use client';

import React, { useEffect, useState } from 'react';
import { usePanel, panelIndexMap } from '../context/PanelContext';
import { menuService, MenuData } from '../services/api';
import Navbar from './Navbar';
import MenuPanel from './panels/MenuPanel';
import ProductPanel from './panels/ProductPanel';
import CartPanel from './panels/CartPanel';
import OrderPanel from './panels/OrderPanel';
import SuccessPanel from './panels/SuccessPanel';

const PanelContainer = () => {
    const { currentPanel } = usePanel();
    const [menuData, setMenuData] = useState<MenuData | null>(null);

    const panelIndex = panelIndexMap[currentPanel];

    useEffect(() => {
        const loadMenu = async () => {
            const data = await menuService.getMenu();
            setMenuData(data);
        };
        loadMenu();
    }, []);

    const restaurantName = menuData?.restaurantName || 'Restaurant';

    // Render only the active panel to avoid transform issues with fixed positioning
    const renderPanel = () => {
        switch (currentPanel) {
            case 'menu':
                return <MenuPanel menuData={menuData} />;
            case 'product':
                return <ProductPanel />;
            case 'cart':
                return <CartPanel />;
            case 'order':
                return <OrderPanel />;
            case 'success':
                return <SuccessPanel />;
            default:
                return <MenuPanel menuData={menuData} />;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Navbar */}
            <Navbar restaurantName={restaurantName} />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 min-h-screen overflow-y-auto">
                <div className="animate-fade-in">
                    {renderPanel()}
                </div>
            </div>
        </div>
    );
};

export default PanelContainer;
