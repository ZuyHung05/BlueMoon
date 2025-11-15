import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoutes';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/engineer/dashboard')));

// utilities routing
const TaskUpdatePage = Loadable(lazy(() => import('views/engineer/taskUpdatePage')));
const HistoryPage = Loadable(lazy(() => import('views/engineer/historyPage')));
const MyTaskPage = Loadable(lazy(() => import('views/engineer/myTaskPage')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const EngineerRoutes = {
  path: '/engineer',
  element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <MainLayout />
      </ProtectedRoute>
    ),
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'my_task',
      element: <MyTaskPage />
    },
    {
      path: 'task_update',
      element: <TaskUpdatePage />
    },
    {
      path: 'history',
      element: <HistoryPage />
    }
  ]
};

export default EngineerRoutes;
