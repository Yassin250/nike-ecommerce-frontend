import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ROUTES } from '../lib/constants';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthContext();
    if (loading) return null;
    if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
    return children;
};

export default ProtectedRoute;