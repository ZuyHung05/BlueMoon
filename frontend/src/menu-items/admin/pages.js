// assets
import KeyIcon from '@mui/icons-material/Key';
// constant
const icons = {
    KeyIcon
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Trang chức năng',
    caption: 'Pages Caption',
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Xác thực',
            type: 'collapse',
            icon: icons.KeyIcon,
            children: [
                {
                    id: 'login',
                    title: 'Đăng nhập',
                    type: 'item',
                    url: '/login',
                    target: true
                },
                {
                    id: 'register',
                    title: 'Đăng ký',
                    type: 'item',
                    url: '/register',
                    target: true
                }
            ]
        }
    ]
};

export default pages;
