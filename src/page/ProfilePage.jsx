import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    User,
    Package,
    Heart,
    MapPin,
    CreditCard,
    Settings,
    LogOut,
    ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user, logout, isAuthenticated, isAdmin, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Redirect to login only after auth state has finished loading
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/account/login");
        }
    }, [isAuthenticated, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navigation = [
        { id: "overview", name: "Overview", icon: User },
        { id: "orders", name: "Orders", icon: Package },
        { id: "wishlist", name: "Wishlist", icon: Heart },
        { id: "addresses", name: "Addresses", icon: MapPin },
        { id: "payment", name: "Payment Methods", icon: CreditCard },
        { id: "settings", name: "Settings", icon: Settings },
    ];

    // Dummy order data
    const orders = [
        {
            id: "ORD001",
            date: "2026-01-28",
            total: 13995,
            status: "Delivered",
            items: 2,
        },
        {
            id: "ORD002",
            date: "2026-01-15",
            total: 25490,
            status: "In Transit",
            items: 3,
        },
        {
            id: "ORD003",
            date: "2026-01-05",
            total: 11495,
            status: "Delivered",
            items: 1,
        },
    ];

    const formatPrice = (price) => {
        return `₹${(price / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    };

    // Show loading spinner while auth state is being resolved
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated after loading, the effect above will navigate away
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1 bg-[#F5F5F5]">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 mb-4">
                                {/* User Info */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E5E5]">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{user?.name || "User"}</h2>
                                        <p className="text-sm text-[#757575]">{user?.email || "user@email.com"}</p>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="space-y-2">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                                    ? "bg-black text-white"
                                                    : "hover:bg-[#F5F5F5] text-[#757575]"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.name}</span>
                                            </button>
                                        );
                                    })}

                                    {isAdmin && (
                                        <button
                                            onClick={() => navigate("/admin")}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F5F5F5] text-[#757575] transition-colors"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            <span className="font-medium">Admin Dashboard</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Log Out</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Overview */}
                            {activeTab === "overview" && (
                                <div>
                                    <h1 className="text-3xl font-bold mb-6">
                                        Welcome back, {user?.name?.split(" ")[0] || "User"}!
                                    </h1>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-white rounded-lg p-6">
                                            <Package className="w-8 h-8 mb-3 text-black" />
                                            <h3 className="text-3xl font-bold mb-1">
                                                {orders.length}
                                            </h3>
                                            <p className="text-sm text-[#757575]">Total Orders</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-6">
                                            <Heart className="w-8 h-8 mb-3 text-black" />
                                            <h3 className="text-3xl font-bold mb-1">
                                                0
                                            </h3>
                                            <p className="text-sm text-[#757575]">Wishlist Items</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-6">
                                            <User className="w-8 h-8 mb-3 text-black" />
                                            <h3 className="text-3xl font-bold mb-1">
                                                {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}
                                            </h3>
                                            <p className="text-sm text-[#757575]">Member Since</p>
                                        </div>
                                    </div>

                                    {/* Recent Orders */}
                                    <div className="bg-white rounded-lg p-6">
                                        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                                        <div className="space-y-4">
                                            {orders.slice(0, 3).map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between py-4 border-b border-[#E5E5E5] last:border-0"
                                                >
                                                    <div>
                                                        <h3 className="font-medium">Order #{order.id}</h3>
                                                        <p className="text-sm text-[#757575]">
                                                            {new Date(order.date).toLocaleDateString()} ·{" "}
                                                            {order.items} items
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">
                                                            {formatPrice(order.total)}
                                                        </p>
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full ${order.status === "Delivered"
                                                                ? "bg-green-100 text-green-800"
                                                                : order.status === "In Transit"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Orders */}
                            {activeTab === "orders" && (
                                <div className="bg-white rounded-lg p-6">
                                    <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-[#E5E5E5] rounded-lg p-6"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg">
                                                            Order #{order.id}
                                                        </h3>
                                                        <p className="text-sm text-[#757575]">
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm ${order.status === "Delivered"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.status === "In Transit"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-[#757575]">
                                                            {order.items} items
                                                        </p>
                                                        <p className="font-bold text-lg">
                                                            {formatPrice(order.total)}
                                                        </p>
                                                    </div>
                                                    <button className="px-6 py-2 border-2 border-black rounded-full font-medium hover:bg-black hover:text-white transition-colors">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist */}
                            {activeTab === "wishlist" && (
                                <div className="bg-white rounded-lg p-6">
                                    <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
                                    <div className="text-center py-20">
                                        <Heart className="w-20 h-20 text-[#CCCCCC] mx-auto mb-4" />
                                        <h3 className="text-xl font-medium mb-2">
                                            Your wishlist is empty
                                        </h3>
                                        <p className="text-[#757575] mb-6">
                                            Save items you love for later
                                        </p>
                                        <button
                                            onClick={() => navigate("/products")}
                                            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-[#111111] transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Addresses */}
                            {activeTab === "addresses" && (
                                <div className="bg-white rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Saved Addresses</h2>
                                        <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-[#111111] transition-colors">
                                            Add New Address
                                        </button>
                                    </div>
                                    <div className="text-center py-20">
                                        <MapPin className="w-20 h-20 text-[#CCCCCC] mx-auto mb-4" />
                                        <h3 className="text-xl font-medium mb-2">
                                            No saved addresses
                                        </h3>
                                        <p className="text-[#757575]">
                                            Add an address to speed up checkout
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Payment Methods */}
                            {activeTab === "payment" && (
                                <div className="bg-white rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Payment Methods</h2>
                                        <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-[#111111] transition-colors">
                                            Add Card
                                        </button>
                                    </div>
                                    <div className="text-center py-20">
                                        <CreditCard className="w-20 h-20 text-[#CCCCCC] mx-auto mb-4" />
                                        <h3 className="text-xl font-medium mb-2">
                                            No payment methods
                                        </h3>
                                        <p className="text-[#757575]">
                                            Add a payment method for faster checkout
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            {activeTab === "settings" && (
                                <div className="bg-white rounded-lg p-6">
                                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue={user?.name}
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue={user?.email}
                                                disabled
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors bg-gray-50 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-[#757575] mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-[#111111] transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}