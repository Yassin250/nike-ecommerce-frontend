import React from "react";
import { Trash2, Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/formatPrice";

export default function CartPage() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        getCartCount,
    } = useCart();

    const navigate = useNavigate();



    // Helper to safely get string value from size/color
    const getDisplayValue = (value) => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
            return value.value || value.name || value.label || JSON.stringify(value);
        }
        return String(value || '');
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 14000 ? 0 : 500;
    const total = subtotal + shipping;

    // Debug: Log cart items to see their structure
    React.useEffect(() => {
        console.log("Cart Items:", cartItems);
        if (cartItems.length > 0) {
            console.log("First item:", cartItems[0]);
        }
    }, [cartItems]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Bag</h1>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="w-24 h-24 text-[#CCCCCC] mx-auto mb-6" />
                            <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                            <p className="text-[#757575] mb-8">
                                Items added to your bag will appear here
                            </p>
                            <button
                                onClick={() => navigate("/products")}
                                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-[#111111] transition-colors"
                            >
                                Shop Now
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                        className="flex gap-6 pb-6 border-b border-[#E5E5E5]"
                                    >
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
                                            <img
                                                src={item.images?.[0] || item.image || '/placeholder-image.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover bg-[#F5F5F5]"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <div>
                                                    <h3 className="font-medium text-lg mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-[#757575] mb-1">
                                                        {item.category}
                                                    </p>
                                                    <p className="text-sm text-[#757575]">
                                                        Size: {getDisplayValue(item.selectedSize)} | Color:{" "}
                                                        {getDisplayValue(item.selectedColor)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-[#E5E5E5] rounded-full">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.selectedSize,
                                                                item.selectedColor,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                        className="p-3 hover:bg-[#F5F5F5] rounded-l-full transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-6 text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.selectedSize,
                                                                item.selectedColor,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                        className="p-3 hover:bg-[#F5F5F5] rounded-r-full transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-4">
                                                    <button className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.id,
                                                                item.selectedSize,
                                                                item.selectedColor,
                                                            )
                                                        }
                                                        className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-600"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-[#F5F5F5] rounded-lg p-6 sticky top-[120px]">
                                    <h2 className="text-xl font-bold mb-6">Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal ({getCartCount()} items)</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Estimated Delivery & Handling</span>
                                            <span>
                                                {shipping === 0 ? "Free" : formatPrice(shipping)}
                                            </span>
                                        </div>
                                    </div>

                                    {shipping > 0 && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                                            <p className="text-xs text-orange-800">
                                                Add ₹{((14000 - subtotal) / 100).toFixed(2)} more to get
                                                free delivery
                                            </p>
                                        </div>
                                    )}

                                    <div className="border-t border-[#E5E5E5] pt-4 mb-6">
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate("/checkout")}
                                        className="block w-full bg-black text-white text-center py-4 rounded-full font-medium hover:bg-[#111111] transition-colors mb-3"
                                    >
                                        Checkout
                                    </button>

                                    <button
                                        onClick={() => navigate("/products")}
                                        className="block w-full border-2 border-black text-black text-center py-4 rounded-full font-medium hover:bg-[#F5F5F5] transition-colors"
                                    >
                                        Continue Shopping
                                    </button>

                                    <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                                        <h3 className="font-medium mb-3">We Accept</h3>
                                        <div className="flex gap-2">
                                            <div className="bg-white border border-[#E5E5E5] rounded px-3 py-2 text-xs font-medium">
                                                VISA
                                            </div>
                                            <div className="bg-white border border-[#E5E5E5] rounded px-3 py-2 text-xs font-medium">
                                                MC
                                            </div>
                                            <div className="bg-white border border-[#E5E5E5] rounded px-3 py-2 text-xs font-medium">
                                                AMEX
                                            </div>
                                            <div className="bg-white border border-[#E5E5E5] rounded px-3 py-2 text-xs font-medium">
                                                UPI
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}