import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// lazy load the landing view (located at src/views/user/landing/index.jsx)
const Landing = Loadable(lazy(() => import('views/user/landing')));

const UserRoutes = {
  path: '/',
  element: <Landing />
  // children: [
  //   {
  //     path: '/',
  //     element: <Landing />
  //   }
  // ]
};

export default UserRoutes;