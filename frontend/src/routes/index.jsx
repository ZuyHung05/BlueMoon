import { createBrowserRouter } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoutes from './AdminRoutes';
import ManagerRoutes from './ManagerRoutes';
import AccountantRoutes from './AccountantRoutes';
import UserRoutes from './UserRoutes';

import RootRedirect from './RootRedirect';

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <RootRedirect />
        },
        AuthenticationRoutes,
        AdminRoutes,
        ManagerRoutes,
        AccountantRoutes,
        UserRoutes
    ],
    {
        basename: import.meta.env.VITE_APP_BASE_NAME
    }
);

export default router;
