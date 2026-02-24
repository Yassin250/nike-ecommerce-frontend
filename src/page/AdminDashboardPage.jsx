import AdminSidebar from "../admin/AdminSidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from 'react-router-dom';

export default function AdminDashboardPage() {
    const { user, isAuthenticated, isAdmin } = useAuth();

    // Redirect if not admin
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
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Products"
                            value="0"
                            change="+0%"
                            positive={true}
                        />
                        <StatCard
                            title="Total Orders"
                            value="0"
                            change="+0%"
                            positive={true}
                        />
                        <StatCard
                            title="Total Users"
                            value="0"
                            change="+0%"
                            positive={true}
                        />
                        <StatCard
                            title="Revenue"
                            value="₹0"
                            change="+0%"
                            positive={true}
                        />
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Welcome, {user?.name}!
                        </h2>
                        <p className="text-gray-600">
                            This is your admin dashboard. Use the sidebar to navigate to different sections.
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Admin features are currently in development.
                                You can manage products, orders, and users through Postman for now.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, change, positive }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-2">{value}</p>
            <p className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {change} from last month
            </p>
        </div>
    );
}
