import menuAdmin from 'menu-items/admin';
import menuManager from 'menu-items/manager';
import menuAccountant from 'menu-items/accountant';
import menuDefault from 'menu-items';

const RoleMenuList = ({ role }) => {
  switch (role) {
    case 'admin':
      return menuAdmin;
    case 'manager':
      return menuManager;
    case 'accountant':
      return menuAccountant;
    default:
      return menuDefault;
  }
};

export default RoleMenuList;