import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoutes';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/admin/dashboard/Default')));

// utilities routing
const ReportPage = Loadable(lazy(() => import('views/admin/reportPage')));
const AdminUserManagementPage = Loadable(lazy(() => import('views/admin/adminUserManagementPage')));

const ResidentManagement = Loadable(lazy(() => import('views/admin/residentmanager/ResidentManagement')));
const DefaultFeeManagement = Loadable(lazy(() => import('views/admin/feemanager/DefaultFeeManagement')));

const VehicleManagement = Loadable(lazy(() => import('views/admin/vehicle/VehicleManagement')));

const PaymentPeriodManagement = Loadable(lazy(() => import('views/admin/feemanager/PaymentPeriodManagement')));

const HouseholdManagement = Loadable(lazy(() => import('views/admin/household/HouseholdManagement')));

const FeeDashboard = Loadable(lazy(() => import('views/admin/dashboard/Default/FeeDashboard')));
const ResidentDashboard = Loadable(lazy(() => import('views/admin/dashboard/Default/ResidentDashboard')));
// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = {
    path: '/',
    element: (
        <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'ACCOUNTANT']}>
            <MainLayout />
        </ProtectedRoute>
    ),
    children: [
        {
            path: 'dashboard',
            // Dashboard is allowed for everyone in the layout (ADMIN, MANAGER, ACCOUNTANT)
            // So no extra wrapper needed, or wrap with all 3 if preferred for consistency.
            element: <DashboardDefault />
        },
        {
            path: 'fee_dashboard',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <FeeDashboard />
                </ProtectedRoute>
            )
        },
        {
            path: 'resident_dashboard',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <ResidentDashboard />
                </ProtectedRoute>
            )
        },
        {
            path: 'resident',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <ResidentManagement />
                </ProtectedRoute>
            )
        },
        {
            path: 'report',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ReportPage />
                </ProtectedRoute>
            )
        },
        {
            path: 'user_management',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUserManagementPage />
                </ProtectedRoute>
            )
        },
        {
            path: 'default-fee',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTANT']}>
                    <DefaultFeeManagement />
                </ProtectedRoute>
            )
        },
        {
            path: 'vehicle',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <VehicleManagement />
                </ProtectedRoute>
            )
        },
        {
            path: 'payment-period',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTANT']}>
                    <PaymentPeriodManagement />
                </ProtectedRoute>
            )
        },
        {
            path: 'household',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <HouseholdManagement />
                </ProtectedRoute>
            )
        }
    ]
};

export default AdminRoutes;
