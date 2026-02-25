import AdminSidebar from '../components/admin/AdminSidebar';
import OrderTable from '../components/admin/OrderTable';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminOrdersPage() {
    const { isAuthenticated, isAdmin } = useAuth();

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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Order Management</h1>
                        <p className="text-gray-600 mt-2">
                            Track and manage customer orders and shipments
                        </p>
                    </div>

                    <OrderTable />
                </div>
            </main>
        </div>
    );
}