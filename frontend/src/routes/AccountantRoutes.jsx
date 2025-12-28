import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoutes';

// dashboard routing
// For now, using a placeholder or sharing a view if appropriate.
// Since no specific accountant dashboard exists yet, we'll use a placeholder or point to a relevant view.
const DashboardDefault = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| ACCOUNTANT ROUTING ||============================== //

const AccountantRoutes = {
    path: '/accountant',
    element: (
        <ProtectedRoute allowedRoles={['ACCOUNTANT']}>
            <MainLayout />
        </ProtectedRoute>
    ),
    children: [
        {
            path: 'dashboard',
            element: <DashboardDefault />
        }
    ]
};

export default AccountantRoutes;
