// assets
import DashboardIcon from '@mui/icons-material/Dashboard';
// constant
const icons = { DashboardIcon };

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
      icon: icons.DashboardIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
