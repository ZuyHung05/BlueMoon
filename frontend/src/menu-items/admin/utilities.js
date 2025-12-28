// assets
import { UserCog, Building, Users, Car, DollarSign, CalendarRange, BarChart3 } from 'lucide-react';

// constant
const icons = {
    UserCog,
    Building,
    Users,
    Car,
    DollarSign,
    CalendarRange,
    BarChart3
};

const utilities = {
    id: 'utilities',
    title: 'Danh mục',
    type: 'group',
    children: [
        {
            id: 'util-user_management',
            title: 'Tài khoản',
            type: 'item',
            url: '/user_management',
            icon: icons.UserCog,
            breadcrumbs: false,
            roles: ['ADMIN']
        },
        {
            id: 'util-household', // <--- 3. Thêm mục Hộ khẩu
            title: 'Hộ khẩu',
            type: 'item',
            url: '/household',
            icon: icons.Building,
            breadcrumbs: false,
            roles: ['ADMIN', 'MANAGER']
        },
        {
            id: 'util-residents',
            title: 'Cư dân',
            type: 'item',
            url: '/resident',
            icon: icons.Users,
            breadcrumbs: false,
            roles: ['ADMIN', 'MANAGER']
        },
        {
            id: 'util-vehicle', // <--- 3. Thêm mục Phương tiện
            title: 'Phương tiện',
            type: 'item',
            url: '/vehicle',
            icon: icons.Car,
            breadcrumbs: false,
            roles: ['ADMIN', 'MANAGER']
        },
        {
            id: 'util-default-fee',
            title: 'Phí cố định',
            type: 'item',
            url: '/default-fee',
            icon: icons.DollarSign,
            breadcrumbs: false,
            roles: ['ADMIN', 'ACCOUNTANT']
        },
        {
            id: 'util-payment-period', // <--- 3. Thêm mục Đợt thu
            title: 'Đợt thu phí',
            type: 'item',
            url: '/payment-period',
            icon: icons.CalendarRange,
            breadcrumbs: false,
            roles: ['ADMIN', 'ACCOUNTANT']
        }
    ]
};

export default utilities;
