// assets
// Place to get icon: https://mui.com/material-ui/material-icons/?query=resident
import ApartmentIcon from '@mui/icons-material/Apartment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// constant
const icons = {
    ApartmentIcon,
    AttachMoneyIcon,
    PeopleAltIcon,
    EngineeringIcon,
    AssessmentIcon,
    ShowChartIcon,
    ManageAccountsIcon,
    DirectionsCarIcon
};

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-residents',
            title: 'Residents',
            type: 'item',
            url: '/admin/resident',
            icon: icons.PeopleAltIcon,
            breadcrumbs: false
        },
        {
            id: 'util-vehicle', // <--- 3. Thêm mục Phương tiện
            title: 'Vehicles',
            type: 'item',
            url: '/admin/vehicle',
            icon: icons.DirectionsCarIcon,
            breadcrumbs: false
        },
        {
            id: 'util-default-fee',
            title: 'Default Fee',
            type: 'item',
            url: '/admin/default-fee',
            icon: icons.AttachMoneyIcon, 
            breadcrumbs: false
        },
        {
            id: 'util-report',
            title: 'Reports',
            type: 'item',
            url: '/admin/report',
            icon: icons.AssessmentIcon,
            breadcrumbs: false
        },
        {
            id: 'util-user_management',
            title: 'User Management',
            type: 'item',
            url: '/admin/user_management',
            icon: icons.ManageAccountsIcon,
            breadcrumbs: false
        }
    ]
};

export default utilities;
