// assets
import { LayoutDashboard } from 'lucide-react';

// constant
const icons = { LayoutDashboard };

// ==============================|| MANAGER DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'engineer-dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/manager/dashboard',
      icon: icons.LayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
