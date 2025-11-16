import adminMenu from './admin';
import managerMenu from './manager';

const path = window.location.pathname; // e.g., "/manager/dashboard"

let menuToExport;

if (path.startsWith("/admin")) {
  menuToExport = adminMenu;

} else if (path.startsWith("/manager")) {
  menuToExport = managerMenu;

} 

export default menuToExport;