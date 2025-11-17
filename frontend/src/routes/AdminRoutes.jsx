import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/admin/dashboard/Default')));

// utilities routing  
const ReportPage = Loadable(lazy(() => import('views/admin/reportPage')));
const AdminUserManagementPage = Loadable(lazy(() => import('views/admin/adminUserManagementPage')));

const UserManager = Loadable(lazy(() => import('views/admin/usermanager/ResidentManagement')));


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
      element: <UserManager />
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
