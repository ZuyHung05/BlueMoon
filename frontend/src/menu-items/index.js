import adminMenu from './admin';
import managerMenu from './engineer';
import accountantMenu from './user';

const role = localStorage.getItem('role'); // or from your AuthContext

let menuToExport;

switch (role) {
  case 'authority':
    menuToExport = adminMenu;
    break;
  case 'technician':
    menuToExport = managerMenu;
    break;
  case 'citizen':
    menuToExport = accountantMenu;
    break;
  default:
    console.log("Do not match any role!")
    menuToExport = adminMenu;
}

export default menuToExport;
