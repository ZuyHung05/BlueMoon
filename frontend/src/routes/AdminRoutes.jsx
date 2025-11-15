import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/admin/dashboard/Default')));

// utilities routing  
const AssignPage = Loadable(lazy(() => import('views/admin/assignPage')));
const ReportPage = Loadable(lazy(() => import('views/admin/reportPage')));
const EngineerPage = Loadable(lazy(() => import('views/admin/engineerPage')));


import ProtectedRoute from './ProtectedRoutes';
// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = {
  path: '/admin',
   element: (
    <ProtectedRoute allowedRoles={['authority']}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'assign',
      element: <AssignPage />
    },
    {
      path: 'report',
      element: <ReportPage />
    },
     {
      path: 'engineer',
      element: <EngineerPage />
    }
  ]
};

export default AdminRoutes;
