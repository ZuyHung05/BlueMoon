import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const normalizedRole = role?.toUpperCase();
    const normalizedAllowedRoles = allowedRoles?.map((r) => r.toUpperCase());

    if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(normalizedRole)) {
        // User has token but wrong role -> Redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
