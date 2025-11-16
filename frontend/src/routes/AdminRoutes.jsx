import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/admin/dashboard/Default')));

// utilities routing  
const AdminResidentPage = Loadable(lazy(() => import('views/admin/residentPage')));
const ReportPage = Loadable(lazy(() => import('views/admin/reportPage')));
const AdminUserManagementPage = Loadable(lazy(() => import('views/admin/adminUserManagementPage')));


import ProtectedRoute from './ProtectedRoutes';
// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = {
  path: '/admin',
   element: (
      <MainLayout />
  ),
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'resident',
      element: <AdminResidentPage />
    },
    {
      path: 'report',
      element: <ReportPage />
    },
     {
      path: 'user_management',
      element: <AdminUserManagementPage />
    }
  ]
};

export default AdminRoutes;
