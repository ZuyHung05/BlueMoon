import adminMenu from './admin';
import managerMenu from './manager';
import accountantMenu from './accountant';

const role = localStorage.getItem('role'); // or from your AuthContext

let menuToExport;

switch (role) {
  case 'admin':
    menuToExport = adminMenu;
    break;
  case 'manager':
    menuToExport = managerMenu;
    break;
  case 'accountant':
    menuToExport = accountantMenu;
    break;
  default:
    menuToExport = adminMenu;
}

export default menuToExport;
