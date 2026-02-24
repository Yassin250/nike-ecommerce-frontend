/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/apiClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}

// Add alias export for backward compatibility
export const useCartContext = useCart;

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth(); // ← NEW: Check if user is logged in
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // ✨ NEW: Fetch cart from backend when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]); // Clear cart if not logged in
        }
    }, [isAuthenticated]);

    // ✨ NEW: Fetch cart from backend
    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.getCart();

            if (response.success && response.data) {
                // Transform backend format to frontend format
                const items = response.data.items.map(item => ({
                    id: item.product._id,
                    name: item.product.name,
                    price: item.priceAtAdd,
                    image: item.product.image,
                    images: item.product.images,
                    category: item.product.category,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor,
                    quantity: item.quantity,
                    _cartItemId: item._id, // Backend cart item ID for updates
                }));

                setCartItems(items);
            }
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✨ NEW: Add to cart via backend
    const addToCart = async (product, sizeOrOptions, color, quantity = 1) => {
        if (!isAuthenticated) {
            alert("Please log in to add items to cart");
            return;
        }

        let selectedSize = sizeOrOptions;
        let selectedColor = color;
        let finalQuantity = quantity;

        // Support object format
        if (sizeOrOptions && typeof sizeOrOptions === "object" && !Array.isArray(sizeOrOptions)) {
            selectedSize = sizeOrOptions.size ?? sizeOrOptions.selectedSize ?? null;
            selectedColor = sizeOrOptions.color ?? sizeOrOptions.selectedColor ?? null;
            finalQuantity = typeof sizeOrOptions.quantity === "number" ? sizeOrOptions.quantity : 1;
        }

        if (selectedSize == null || selectedColor == null) {
            return;
        }

        try {
            await api.addToCart(product.id || product._id, finalQuantity, selectedSize, selectedColor);
            await fetchCart(); // Refresh cart from backend
            setIsCartOpen(true);
        } catch (err) {
            console.error("Failed to add to cart:", err);
            alert(err.message || "Failed to add item to cart");
        }
    };

    // ✨ NEW: Update quantity via backend
    const updateQuantity = async (itemId, selectedSize, selectedColor, newQuantity) => {
        const item = cartItems.find(
            i => i.id === itemId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
        );

        if (!item) {
            console.error("Cart item not found");
            return;
        }

        if (newQuantity < 1) {
            await removeFromCart(itemId, selectedSize, selectedColor);
            return;
        }

        try {
            await api.updateCartItem(item._cartItemId, newQuantity);
            await fetchCart();
        } catch (err) {
            console.error("Failed to update quantity:", err);
            alert(err.message || "Failed to update quantity");
        }
    };

    // ✨ NEW: Remove from cart via backend
    const removeFromCart = async (itemId, selectedSize, selectedColor) => {
        const item = cartItems.find(
            i => i.id === itemId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
        );

        if (!item) {
            console.error("Cart item not found");
            return;
        }

        try {
            await api.removeCartItem(item._cartItemId);
            await fetchCart();
        } catch (err) {
            console.error("Failed to remove from cart:", err);
            alert(err.message || "Failed to remove item");
        }
    };

    // ✨ NEW: Clear cart via backend
    const clearCart = async () => {
        try {
            await api.clearCart();
            setCartItems([]);
        } catch (err) {
            console.error("Failed to clear cart:", err);
            alert(err.message || "Failed to clear cart");
        }
    };

    // These stay the same (calculate from cartItems state)
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        loading,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        setIsCartOpen,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}