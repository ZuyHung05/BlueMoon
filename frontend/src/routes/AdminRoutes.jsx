import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/admin/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/admin/assignPage')));
const UtilsColor = Loadable(lazy(() => import('views/admin/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/admin/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
import ProtectedRoute from './ProtectedRoutes';
// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = {
  path: '/admin',
   element: (
    <ProtectedRoute allowedRoles={['admin']}>
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
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default AdminRoutes;
