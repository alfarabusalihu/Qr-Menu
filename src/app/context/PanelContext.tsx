'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '../services/api';

export type PanelType = 'menu' | 'product' | 'cart' | 'order' | 'success';

interface PanelContextType {
    currentPanel: PanelType;
    selectedProduct: MenuItem | null;
    panelHistory: PanelType[];
    goTo: (panel: PanelType) => void;
    goToProduct: (item: MenuItem) => void;
    goBack: () => void;
    goToMenu: () => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

const panelIndexMap: Record<PanelType, number> = {
    menu: 0,
    product: 1,
    cart: 2,
    order: 3,
    success: 4,
};

export const PanelProvider = ({ children }: { children: ReactNode }) => {
    const [currentPanel, setCurrentPanel] = useState<PanelType>('menu');
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
    const [panelHistory, setPanelHistory] = useState<PanelType[]>(['menu']);

    const goTo = (panel: PanelType) => {
        setCurrentPanel(panel);
        setPanelHistory(prev => [...prev, panel]);
    };

    const goToProduct = (item: MenuItem) => {
        setSelectedProduct(item);
        goTo('product');
    };

    const goBack = () => {
        if (panelHistory.length > 1) {
            const newHistory = [...panelHistory];
            newHistory.pop();
            const previousPanel = newHistory[newHistory.length - 1];
            setCurrentPanel(previousPanel);
            setPanelHistory(newHistory);
        }
    };

    const goToMenu = () => {
        setCurrentPanel('menu');
        setSelectedProduct(null);
        setPanelHistory(['menu']);
    };

    return (
        <PanelContext.Provider value={{
            currentPanel,
            selectedProduct,
            panelHistory,
            goTo,
            goToProduct,
            goBack,
            goToMenu,
        }}>
            {children}
        </PanelContext.Provider>
    );
};

export const usePanel = () => {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error('usePanel must be used within a PanelProvider');
    }
    return context;
};

export { panelIndexMap };
