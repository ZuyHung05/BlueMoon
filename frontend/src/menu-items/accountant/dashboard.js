// assets
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// constant
const icons = { AccountBalanceWalletIcon };

// ==============================|| ACCOUNTANT DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'accountant-dashboard',
      title: 'Accountant Dashboard',
      type: 'item',
      url: '/dashboard/accountant',
      icon: icons.AccountBalanceWalletIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
