import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoutes';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/manager/dashboard')));
const HouseholdPage = Loadable(lazy(() => import('views/manager/householdPage')));
const ResidentPage = Loadable(lazy(() => import('views/manager/residentPage')));


// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const EngineerRoutes = {
  path: '/manager',
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
      element: <ResidentPage />
    },
     {
      path: 'household',
      element: <HouseholdPage />
    }
  
  ]
};

export default EngineerRoutes;
