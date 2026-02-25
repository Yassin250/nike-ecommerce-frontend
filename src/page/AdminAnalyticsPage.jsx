import AdminSidebar from '../components/admin/AdminSidebar';
import AnalyticsOverview from '../components/admin/AnalyticsOverview';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/apiClient';
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
    const { isAuthenticated, isAdmin } = useAuth();
    const [revenueData, setRevenueData] = useState(null);
    const [productData, setProductData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        fetchAnalytics();
    }, [days]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [revenue, products, users] = await Promise.all([
                api.adminGetRevenueAnalytics(days),
                api.adminGetProductAnalytics(),
                api.adminGetUserAnalytics(days),
            ]);

            if (revenue.success) setRevenueData(revenue.data);
            if (products.success) setProductData(products.data);
            if (users.success) setUserData(users.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-2">
                            Detailed insights into your business performance
                        </p>
                    </div>

                    {/* Overview Stats */}
                    <AnalyticsOverview />

                    {/* Time Period Selector */}
                    <div className="flex gap-2">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-2 rounded-lg font-medium ${days === d
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Last {d} Days
                            </button>
                        ))}
                    </div>

                    {/* Revenue Analytics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Revenue Analytics</h2>
                                <p className="text-sm text-gray-500">Last {days} days</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                        ) : revenueData ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                        <p className="text-2xl font-bold">
                                            ₹{((revenueData.totalRevenue || 0) / 100).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                                        <p className="text-2xl font-bold">
                                            ₹{((revenueData.averageOrderValue || 0) / 100).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                        <p className="text-2xl font-bold">
                                            {revenueData.totalOrders || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Revenue by Period Chart Placeholder */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <TrendingUp className="mx-auto text-gray-400 mb-2" size={48} />
                                    <p className="text-gray-600">Revenue chart coming soon</p>
                                    <p className="text-sm text-gray-400">Chart.js integration pending</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No revenue data available</p>
                        )}
                    </div>

                    {/* Product Analytics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                                <Package size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Product Performance</h2>
                                <p className="text-sm text-gray-500">Top selling products</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                        ) : productData?.topProducts && productData.topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {productData.topProducts.slice(0, 5).map((product, index) => (
                                    <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{product.salesCount} sales</p>
                                            <p className="text-sm text-gray-500">
                                                ₹{((product.revenue || 0) / 100).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No product data available</p>
                        )}
                    </div>

                    {/* User Analytics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                                <ShoppingCart size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">User Growth</h2>
                                <p className="text-sm text-gray-500">Last {days} days</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                        ) : userData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">New Users</p>
                                    <p className="text-2xl font-bold">{userData.newUsers || 0}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                    <p className="text-2xl font-bold">{userData.totalUsers || 0}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No user data available</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}