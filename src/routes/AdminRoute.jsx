import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ROUTES } from '../lib/constants';

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuthContext();
    if (loading) return null;
    if (!user || !isAdmin) return <Navigate to={ROUTES.HOME} replace />;
    return children;
};

export default AdminRoute;