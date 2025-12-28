import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on role
    switch (role?.toLowerCase()) {
        case 'admin':
        case 'manager':
        case 'accountant':
            return <Navigate to="/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />; // Nếu không có role hợp lệ, logout
    }
};

export default RootRedirect;
