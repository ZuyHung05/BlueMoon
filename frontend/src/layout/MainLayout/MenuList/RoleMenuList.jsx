import menuAdmin from 'menu-items/admin';
import menuManager from 'menu-items/engineer';
import menuAccountant from 'menu-items/user';
import menuDefault from 'menu-items';

const RoleMenuList = ({ role }) => {
  switch (role) {
    case 'admin':
      return menuAdmin;
    case 'engineer':
      return menuManager;
    case 'user':
      return menuAccountant;
    default:
      return menuDefault;
  }
};

export default RoleMenuList;