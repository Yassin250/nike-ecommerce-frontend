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
import api from "../lib/apiClient";

export default function ProfilePage() {
    const { user, logout, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(false);
    //const [wishlist, setWishlist] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [newAddress, setNewAddress] = useState({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        isDefault: false,
    });
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Redirect to login only after auth state has finished loading
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/account/login");
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load user data when authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
            });
            fetchOrders();
            fetchAddresses();
            // fetchWishlist(); // Uncomment when wishlist is implemented
        }
    }, [isAuthenticated, user]);

    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            const response = await api.getOrders();
            if (response.success) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setAddressesLoading(true);
            const response = await api.getAddresses?.(); // You'll need to add this to apiClient
            if (response?.success) {
                setAddresses(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setAddressesLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const response = await api.updateProfile({
                name: formData.name,
                phone: formData.phone,
            });
            if (response.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        try {
            setUpdating(true);
            const response = await api.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            if (response.success) {
                setMessage({ type: "success", text: "Password changed successfully!" });
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to change password" });
        } finally {
            setUpdating(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const response = await api.addAddress?.(newAddress); // You'll need to add this to apiClient
            if (response?.success) {
                setMessage({ type: "success", text: "Address added successfully!" });
                setShowAddressForm(false);
                setNewAddress({
                    label: "Home",
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "USA",
                    isDefault: false,
                });
                fetchAddresses();
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to add address" });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            setUpdating(true);
            const response = await api.deleteAddress?.(addressId); // You'll need to add this to apiClient
            if (response?.success) {
                setMessage({ type: "success", text: "Address deleted successfully!" });
                fetchAddresses();
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to delete address" });
        } finally {
            setUpdating(false);
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            setUpdating(true);
            const response = await api.setDefaultAddress?.(addressId); // You'll need to add this to apiClient
            if (response?.success) {
                setMessage({ type: "success", text: "Default address updated!" });
                fetchAddresses();
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update default address" });
        } finally {
            setUpdating(false);
        }
    };

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

    const formatUSD = (price) => {
        if (price === undefined || price === null) return "$0.00";
        // Convert cents to dollars
        const dollars = price / 100;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(dollars);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            placed: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            processing: "bg-purple-100 text-purple-800",
            shipped: "bg-indigo-100 text-indigo-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    // Show loading spinner while auth state is being resolved
    if (authLoading) {
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
    if (!isAuthenticated || !user) {
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
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{user?.name || "User"}</h2>
                                        <p className="text-sm text-[#757575]">{user?.email}</p>
                                        {user?.phone && (
                                            <p className="text-xs text-[#757575] mt-1">{user.phone}</p>
                                        )}
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
                            {/* Message Alert */}
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-lg ${message.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                                    }`}>
                                    {message.text}
                                </div>
                            )}

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
                                                0  {/* Wishlist coming soon */}
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
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold">Recent Orders</h2>
                                            <button
                                                onClick={() => setActiveTab("orders")}
                                                className="text-sm text-[#757575] hover:text-black underline"
                                            >
                                                View All
                                            </button>
                                        </div>
                                        {ordersLoading ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                                            </div>
                                        ) : orders.length > 0 ? (
                                            <div className="space-y-4">
                                                {orders.slice(0, 3).map((order) => (
                                                    <div
                                                        key={order._id}
                                                        className="flex items-center justify-between py-4 border-b border-[#E5E5E5] last:border-0"
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">Order #{order.orderNumber || order._id.slice(-6)}</h3>
                                                            <p className="text-sm text-[#757575]">
                                                                {formatDate(order.createdAt)} ·{" "}
                                                                {order.items?.length || 0} items
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">
                                                                {formatUSD(order.total)}
                                                            </p>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                                                                {order.orderStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center py-8 text-[#757575]">No orders yet</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Orders */}
                            {activeTab === "orders" && (
                                <div className="bg-white rounded-lg p-6">
                                    <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                                    {ordersLoading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                                            <p className="text-[#757575]">Loading orders...</p>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className="border border-[#E5E5E5] rounded-lg p-6"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg">
                                                                Order #{order.orderNumber || order._id.slice(-8)}
                                                            </h3>
                                                            <p className="text-sm text-[#757575]">
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm text-[#757575]">
                                                                {order.items?.length || 0} items
                                                            </p>
                                                            <p className="font-bold text-lg">
                                                                {formatUSD(order.total)}
                                                            </p>
                                                        </div>
                                                        <button className="px-6 py-2 border-2 border-black rounded-full font-medium hover:bg-black hover:text-white transition-colors">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <Package className="w-20 h-20 text-[#CCCCCC] mx-auto mb-4" />
                                            <h3 className="text-xl font-medium mb-2">
                                                No orders yet
                                            </h3>
                                            <p className="text-[#757575] mb-6">
                                                Start shopping to see your orders here
                                            </p>
                                            <button
                                                onClick={() => navigate("/products")}
                                                className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-[#111111] transition-colors"
                                            >
                                                Shop Now
                                            </button>
                                        </div>
                                    )}
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
                                        <button
                                            onClick={() => setShowAddressForm(!showAddressForm)}
                                            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-[#111111] transition-colors"
                                        >
                                            {showAddressForm ? "Cancel" : "Add New Address"}
                                        </button>
                                    </div>

                                    {showAddressForm && (
                                        <form onSubmit={handleAddAddress} className="mb-8 p-6 border border-[#E5E5E5] rounded-lg">
                                            <h3 className="text-lg font-medium mb-4">Add New Address</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Label</label>
                                                    <select
                                                        value={newAddress.label}
                                                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black"
                                                    >
                                                        <option value="Home">Home</option>
                                                        <option value="Work">Work</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Street Address</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.street}
                                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">City</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.city}
                                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">State</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.state}
                                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.zipCode}
                                                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Country</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.country}
                                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black"
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="isDefault"
                                                        checked={newAddress.isDefault}
                                                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                        className="w-5 h-5 rounded border-2 border-[#CCCCCC] checked:bg-black checked:border-black"
                                                    />
                                                    <label htmlFor="isDefault" className="ml-2 text-sm text-[#757575]">
                                                        Set as default address
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={updating}
                                                className="mt-4 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-[#111111] transition-colors disabled:bg-gray-400"
                                            >
                                                {updating ? "Saving..." : "Save Address"}
                                            </button>
                                        </form>
                                    )}

                                    {addressesLoading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                                        </div>
                                    ) : addresses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addresses.map((address) => (
                                                <div
                                                    key={address._id}
                                                    className={`p-4 border rounded-lg ${address.isDefault ? 'border-black bg-gray-50' : 'border-[#E5E5E5]'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-medium">{address.label}</span>
                                                        {address.isDefault && (
                                                            <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm">{address.street}</p>
                                                    <p className="text-sm">{address.city}, {address.state} {address.zipCode}</p>
                                                    <p className="text-sm">{address.country}</p>
                                                    <div className="flex gap-2 mt-3">
                                                        {!address.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(address._id)}
                                                                className="text-xs text-blue-600 hover:text-blue-800"
                                                            >
                                                                Set as Default
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteAddress(address._id)}
                                                            className="text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <MapPin className="w-20 h-20 text-[#CCCCCC] mx-auto mb-4" />
                                            <h3 className="text-xl font-medium mb-2">
                                                No saved addresses
                                            </h3>
                                            <p className="text-[#757575]">
                                                Add an address to speed up checkout
                                            </p>
                                        </div>
                                    )}
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

                                    {/* Profile Update Form */}
                                    <form onSubmit={handleProfileUpdate} className="space-y-6 mb-8 pb-8 border-b border-[#E5E5E5]">
                                        <h3 className="text-lg font-medium">Profile Information</h3>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={user?.email}
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
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Enter phone number"
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-[#111111] transition-colors disabled:bg-gray-400"
                                        >
                                            {updating ? "Saving..." : "Save Changes"}
                                        </button>
                                    </form>

                                    {/* Change Password Form */}
                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <h3 className="text-lg font-medium">Change Password</h3>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                                minLength={6}
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                            <p className="text-xs text-[#757575] mt-1">Minimum 6 characters</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-[#111111] transition-colors disabled:bg-gray-400"
                                        >
                                            {updating ? "Updating..." : "Change Password"}
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