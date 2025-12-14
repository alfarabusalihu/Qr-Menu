import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, MenuItem, Order, UserDetails, PaymentMethod, generateId, generateOrderId } from '@/services/api';

interface State {
    cart: CartItem[];
    sessionId: string | null;
    order: Order | null;

    // Cart Actions
    addToCart: (item: MenuItem, quantity?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => { totalItems: number; totalPrice: number };

    // Session Actions
    initializeSession: () => void;

    // Order Actions
    createOrder: (userDetails: UserDetails, paymentMethod: PaymentMethod) => Order;
    setOrder: (order: Order) => void;
    clearOrder: () => void;
}

export const useStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            sessionId: null,
            order: null,

            addToCart: (item: MenuItem, quantity = 1) => {
                set((state) => {
                    const existingItemIndex = state.cart.findIndex((i) => i.id === item.id);
                    if (existingItemIndex >= 0) {
                        const newCart = [...state.cart];
                        newCart[existingItemIndex].quantity += quantity;
                        return { cart: newCart };
                    }
                    return { cart: [...state.cart, { ...item, quantity }] };
                });
            },

            removeFromCart: (itemId: string) => {
                set((state) => ({
                    cart: state.cart.filter((i) => i.id !== itemId),
                }));
            },

            updateQuantity: (itemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(itemId);
                    return;
                }
                set((state) => ({
                    cart: state.cart.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
                }));
            },

            clearCart: () => set({ cart: [] }),

            getCartTotal: () => {
                const { cart } = get();
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return { totalItems, totalPrice };
            },

            initializeSession: () => {
                const { sessionId } = get();
                if (!sessionId) {
                    // Generate a random table number 1-20 for demo purposes if not present
                    const tableNum = Math.floor(Math.random() * 20) + 1;
                    const random = generateId();
                    const newSessionId = `SES-TBL${tableNum}-${random}`;
                    set({ sessionId: newSessionId });
                }
            },

            createOrder: (userDetails: UserDetails, paymentMethod: PaymentMethod) => {
                const { cart, sessionId } = get();
                if (!sessionId) throw new Error("Session ID missing");

                const order: Order = {
                    id: generateOrderId(),
                    sessionId,
                    items: [...cart],
                    userDetails,
                    status: 'pending',
                    paymentMethod,
                    paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'pending',
                    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    createdAt: new Date().toISOString(),
                };

                set({ order });
                return order;
            },

            setOrder: (order: Order) => set({ order }),

            clearOrder: () => set({ order: null }),
        }),
        {
            name: 'restaurant-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // We will manually hydrate or handle hydration mismatch issues if needed, but usually default is fine. Actually skipHydration: true means we need to handle it. Let's remove it or handle it.  Wait, for Next.js SSR, persist can cause hydration errors. 
            // Common pattern is to use a custom hook for hydration or just accept it might be empty on server.
            // Better: keep it simple first.
        }
    )
);
