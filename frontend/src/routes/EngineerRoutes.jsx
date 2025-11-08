import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/engineer/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/engineer/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/engineer/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/engineer/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const EngineerRoutes = {
  path: '/engineer',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'typography',
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

export default EngineerRoutes;
