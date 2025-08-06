import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && user) {
        const hasRequiredRole = user.roles.some((role) => roles.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;