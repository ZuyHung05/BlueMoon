import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './AdminRoutes';
import EngineerRoutes from './EngineerRoutes';
// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([EngineerRoutes, AuthenticationRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
