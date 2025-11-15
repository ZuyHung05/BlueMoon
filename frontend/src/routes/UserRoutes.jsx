import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoutes';
// lazy load the landing view (located at src/views/user/landing/index.jsx)
const UserHomePage = Loadable(lazy(() => import('views/user/userHomePage')));
const ReportProblemPage = Loadable(lazy(() => import('views/user/reportProblemPage')));
const MyReportPage = Loadable(lazy(() => import('views/user/myReportPage')));

const UserRoutes = {
  path: '/user/',
  element: (
      <ProtectedRoute allowedRoles={['citizen']}>
        <MainLayout />
      </ProtectedRoute>
    ),
  children: [
    {
      path: 'home',
      element: <UserHomePage />
    },
    {
      path: 'report_problem',
      element: <ReportProblemPage />
    },
    {
      path: 'my_report',
      element: <MyReportPage />
    }
  ]
};

export default UserRoutes;