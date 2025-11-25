import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

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
// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = {
    path: '/admin',
    element: <MainLayout />,
    children: [
        {
            path: 'dashboard',
            element: <DashboardDefault />
        },
        {
            path: 'resident',
            element: <ResidentManagement />
        },
        {
            path: 'report',
            element: <ReportPage />
        },
        {
            path: 'user_management',
            element: <AdminUserManagementPage />
        },
        {
            path: 'default-fee',
            element: <DefaultFeeManagement />
        },
        {
            path: 'vehicle',
            element: <VehicleManagement />
        },
        {
            path: 'payment-period',
            element: <PaymentPeriodManagement />
        },
        {
            path: 'household',
            element: <HouseholdManagement />
        }
    ]
};

export default AdminRoutes;
