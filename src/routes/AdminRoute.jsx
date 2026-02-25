import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }

    // Check if user is admin
    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}