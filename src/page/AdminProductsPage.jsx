import AdminSidebar from '../components/admin/AdminSidebar';
import ProductTable from '../components/admin/ProductTable';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminProductsPage() {
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
                        <h1 className="text-3xl font-bold">Product Management</h1>
                        <p className="text-gray-600 mt-2">
                            Manage your product catalog, pricing, and inventory
                        </p>
                    </div>

                    <ProductTable />
                </div>
            </main>
        </div>
    );
}