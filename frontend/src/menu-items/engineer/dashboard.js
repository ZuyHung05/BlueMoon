// assets
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// constant
const icons = { ManageAccountsIcon };

// ==============================|| MANAGER DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'engineer-dashboard',
      title: 'Engineer Dashboard',
      type: 'item',
      url: '/dashboard/engineer',
      icon: icons.ManageAccountsIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
