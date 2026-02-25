import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../lib/apiClient';

export default function AnalyticsOverview() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.adminGetAnalytics();
            if (response.success) {
                setAnalytics(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${((analytics?.totalRevenue || 0) / 100).toLocaleString()}`,
            change: '+12.5%',
            positive: true,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Products',
            value: analytics?.totalProducts || 0,
            change: '+3',
            positive: true,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Orders',
            value: analytics?.totalOrders || 0,
            change: '+8.2%',
            positive: true,
            icon: ShoppingCart,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Total Users',
            value: analytics?.totalUsers || 0,
            change: '+4.1%',
            positive: true,
            icon: Users,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}

function StatCard({ title, value, change, positive, icon: Icon, color, bgColor }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`${bgColor} ${color} p-3 rounded-lg`}>
                    <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
                    {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {change}
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}