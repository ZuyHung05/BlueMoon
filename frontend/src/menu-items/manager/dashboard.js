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
      id: 'manager-dashboard',
      title: 'Manager Dashboard',
      type: 'item',
      url: '/dashboard/manager',
      icon: icons.ManageAccountsIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
