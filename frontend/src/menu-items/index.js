import adminMenu from './admin';
import managerMenu from './engineer';
import accountantMenu from './user';

const role = localStorage.getItem('role'); // or from your AuthContext

let menuToExport;

switch (role) {
  case 'admin':
    menuToExport = adminMenu;
    break;
  case 'engineer':
    menuToExport = managerMenu;
    break;
  case 'user':
    menuToExport = accountantMenu;
    break;
  default:
    menuToExport = adminMenu;
}

export default menuToExport;
