// assets
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';

// constant
const icons = { DashboardIcon };

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
      icon: icons.DashboardIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
