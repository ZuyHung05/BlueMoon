// assets
import { LayoutDashboard } from 'lucide-react';

// constant
const icons = { LayoutDashboard };

// ==============================|| MANAGER DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Tổng quan',
  type: 'group',
  children: [
    {
      id: 'engineer-dashboard',
      title: 'Tổng quan',
      type: 'item',
      url: '/manager/dashboard',
      icon: icons.LayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
