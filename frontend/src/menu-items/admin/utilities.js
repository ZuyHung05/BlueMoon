// assets
import {
  UserCog,
  Building,
  Users,
  Car,
  DollarSign,
  CalendarRange,
  BarChart3
} from 'lucide-react';

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
    title: 'Menu',
    type: 'group',
    children: [
        {
            id: 'util-user_management',
            title: 'Account',
            type: 'item',
            url: '/admin/user_management',
            icon: icons.UserCog,
            breadcrumbs: false
        },
        {
            id: 'util-household', // <--- 3. Thêm mục Hộ khẩu
            title: 'Households',
            type: 'item',
            url: '/admin/household',
            icon: icons.Building,
            breadcrumbs: false
        },
        {
            id: 'util-residents',
            title: 'Residents',
            type: 'item',
            url: '/admin/resident',
            icon: icons.Users,
            breadcrumbs: false
        },
        {
            id: 'util-vehicle', // <--- 3. Thêm mục Phương tiện
            title: 'Vehicles',
            type: 'item',
            url: '/admin/vehicle',
            icon: icons.Car,
            breadcrumbs: false
        },
        {
            id: 'util-default-fee',
            title: 'Default Fee',
            type: 'item',
            url: '/admin/default-fee',
            icon: icons.DollarSign,
            breadcrumbs: false
        },
        {
            id: 'util-payment-period', // <--- 3. Thêm mục Đợt thu
            title: 'Fee Periods',
            type: 'item',
            url: '/admin/payment-period',
            icon: icons.CalendarRange,
            breadcrumbs: false
        },
        {
            id: 'util-report',
            title: 'Reports',
            type: 'item',
            url: '/admin/report',
            icon: icons.BarChart3,
            breadcrumbs: false
        },
    ]
};

export default utilities;
