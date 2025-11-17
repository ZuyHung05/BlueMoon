import { createBrowserRouter } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoutes from './AdminRoutes';
import ManagerRoutes from './ManagerRoutes';
import UserRoutes from './UserRoutes';

const router = createBrowserRouter(
  [
    AuthenticationRoutes,
    AdminRoutes,
    ManagerRoutes,
    UserRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;