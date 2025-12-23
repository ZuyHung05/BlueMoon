// assets
import { LayoutDashboard } from 'lucide-react';
// constant
const icons = { LayoutDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/admin/dashboard',
      icon: icons.LayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
