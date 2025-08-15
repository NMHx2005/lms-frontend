import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@/store/index.ts';

export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Teacher = 'teacher',
}

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth, shallowEqual);
    const location = useLocation();
    
    // Dùng tạm biến này để cho qua việc bắt phải đăng nhập, do chỉ đang triển khai giao diện, chưa có tính năng đăng nhập nhé
    const test = true;
    
    // Nếu test = true, bypass authentication hoàn toàn
    if (test) {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (roles.length > 0 && user && user.roles) {
        const hasRequiredRole = user.roles.some((role) => roles.includes(role as UserRole));
        if (!hasRequiredRole) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;