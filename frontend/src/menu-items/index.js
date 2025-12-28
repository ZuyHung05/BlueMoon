import adminMenu from './admin';
import managerMenu from './manager';
import userMenu from './user';

const menuItems = {
    get items() {
        const role = localStorage.getItem('role')?.toUpperCase();

        // Check for management roles
        if (['ADMIN', 'MANAGER', 'ACCOUNTANT'].includes(role)) {
            return adminMenu.items;
        }

        // Default to user menu or other menus based on future logic
        // Assuming 'USER' or others fall here
        return userMenu.items;
    }
};

export default menuItems;
