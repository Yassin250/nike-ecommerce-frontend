import React, { useState } from "react";
import { Check } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/formatPrice";

export default function CheckoutPage() {
    const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        paymentMethod: "card",
        cardNumber: "",
        cardExpiry: "",
        cardCVV: "",
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 14000 ? 0 : 500;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Process order
            alert("Order placed successfully!");
            clearCart();
            window.location.href = "/";
        }
    };

    if (cartItems.length === 0 && step < 4) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                        <a href="/products" className="text-blue-600 hover:underline">
                            Continue shopping
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1 bg-[#F5F5F5]">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Progress Steps */}
                    <div className="bg-white rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-between">
                            {["Shipping", "Payment", "Review"].map((stepName, index) => (
                                <div key={stepName} className="flex items-center">
                                    <div
                                        className={`flex items-center ${index < 2 ? "flex-1" : ""}`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step > index + 1
                                                ? "bg-green-500 text-white"
                                                : step === index + 1
                                                    ? "bg-black text-white"
                                                    : "bg-[#E5E5E5] text-[#757575]"
                                                }`}
                                        >
                                            {step > index + 1 ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <span
                                            className={`ml-3 font-medium hidden sm:block ${step === index + 1 ? "text-black" : "text-[#757575]"
                                                }`}
                                        >
                                            {stepName}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div
                                            className={`h-1 w-full mx-4 ${step > index + 1 ? "bg-green-500" : "bg-[#E5E5E5]"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
                                {/* Step 1: Shipping Information */}
                                {step === 1 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Shipping Information
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium mb-2">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    ZIP Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Payment Information */}
                                {step === 2 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Payment Information
                                        </h2>

                                        <div className="space-y-4 mb-6">
                                            <label className="flex items-center p-4 border-2 border-[#E5E5E5] rounded-lg cursor-pointer hover:border-black transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="card"
                                                    checked={formData.paymentMethod === "card"}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 accent-black"
                                                />
                                                <span className="ml-3 font-medium">
                                                    Credit / Debit Card
                                                </span>
                                            </label>

                                            <label className="flex items-center p-4 border-2 border-[#E5E5E5] rounded-lg cursor-pointer hover:border-black transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="upi"
                                                    checked={formData.paymentMethod === "upi"}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 accent-black"
                                                />
                                                <span className="ml-3 font-medium">UPI</span>
                                            </label>

                                            <label className="flex items-center p-4 border-2 border-[#E5E5E5] rounded-lg cursor-pointer hover:border-black transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={formData.paymentMethod === "cod"}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 accent-black"
                                                />
                                                <span className="ml-3 font-medium">
                                                    Cash on Delivery
                                                </span>
                                            </label>
                                        </div>

                                        {formData.paymentMethod === "card" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        required={formData.paymentMethod === "card"}
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">
                                                            Expiry Date
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cardExpiry"
                                                            value={formData.cardExpiry}
                                                            onChange={handleInputChange}
                                                            placeholder="MM/YY"
                                                            required={formData.paymentMethod === "card"}
                                                            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cardCVV"
                                                            value={formData.cardCVV}
                                                            onChange={handleInputChange}
                                                            placeholder="123"
                                                            required={formData.paymentMethod === "card"}
                                                            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Review Order */}
                                {step === 3 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6">Review Order</h2>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-medium mb-2">Shipping Address</h3>
                                                <p className="text-sm text-[#757575]">
                                                    {formData.firstName} {formData.lastName}
                                                    <br />
                                                    {formData.address}
                                                    <br />
                                                    {formData.city}, {formData.state} {formData.zipCode}
                                                    <br />
                                                    {formData.email} | {formData.phone}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-2">Payment Method</h3>
                                                <p className="text-sm text-[#757575]">
                                                    {formData.paymentMethod === "card" &&
                                                        "Credit / Debit Card"}
                                                    {formData.paymentMethod === "upi" && "UPI"}
                                                    {formData.paymentMethod === "cod" &&
                                                        "Cash on Delivery"}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-4">Order Items</h3>
                                                <div className="space-y-4">
                                                    {cartItems.map((item) => (
                                                        <div
                                                            key={`${item.id}-${item.selectedSize}`}
                                                            className="flex gap-4"
                                                        >
                                                            <img
                                                                src={item.images?.[0] || item.image || '/placeholder-image.jpg'}
                                                                alt={item.name}
                                                                className="w-20 h-20 object-cover bg-[#F5F5F5]"
                                                            />
                                                            <div className="flex-1">
                                                                <h4 className="font-medium">{item.name}</h4>
                                                                <p className="text-sm text-[#757575]">
                                                                    Size: {item.selectedSize} | Qty:{" "}
                                                                    {item.quantity}
                                                                </p>
                                                                <p className="text-sm font-medium">
                                                                    {formatPrice(item.price * item.quantity)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4 mt-8">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="flex-1 border-2 border-black text-black py-4 rounded-full font-medium hover:bg-[#F5F5F5] transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:bg-[#111111] transition-colors"
                                    >
                                        {step === 3 ? "Place Order" : "Continue"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 sticky top-[120px]">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal ({getCartCount()} items)</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span>
                                            {shipping === 0 ? "Free" : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax (18%)</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-[#E5E5E5] pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}