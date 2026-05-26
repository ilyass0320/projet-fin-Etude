// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CartItem = {
    id: string | number;
    marque: string;
    model: string;
    prix: string;
    img_vehicule: string;
    transaction: string;
    qty: number;
    type: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "qty">) => void;
    removeFromCart: (id: string | number) => void;
    clearCart: () => void;
    totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    // Et après chaque modification :
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    const addToCart = (item: Omit<CartItem, "qty">) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id: string | number) =>
        setCart((prev) => prev.filter((i) => i.id !== id));

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};