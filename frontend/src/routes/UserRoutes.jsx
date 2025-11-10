import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoutes';
// lazy load the landing view (located at src/views/user/landing/index.jsx)
const Landing = Loadable(lazy(() => import('views/user/landing')));

const UserRoutes = {
  path: '/user',
  element: (
      <ProtectedRoute allowedRoles={['user']}>
        <Landing />
      </ProtectedRoute>
    )
};

export default UserRoutes;