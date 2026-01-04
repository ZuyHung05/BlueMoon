// assets
import { LayoutDashboard } from 'lucide-react';
// constant
const icons = { LayoutDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Tổng quan',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Tổng quan',
            type: 'item',
            url: '/dashboard',
            icon: icons.LayoutDashboard,
            breadcrumbs: false,
            roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT']
        }
    ]
};

export default dashboard;
