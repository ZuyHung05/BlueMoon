// (Bạn cần import icon từ thư viện icon của dự án, ví dụ: @tabler/icons-react)
import { IconUsers } from '@tabler/icons-react';

// ==============================|| USER MANAGEMENT MENU ITEM ||============================== //

const usermanager = {
    id: 'user-management', // ID duy nhất cho mục menu này
    title: 'Quản lý Người dùng', // Tên hiển thị trên menu
    type: 'item', // Loại: 'item' (một link), 'collapse' (có menu con), 'group' (tiêu đề nhóm)
    url: '/admin/user-management', // <-- QUAN TRỌNG: Phải khớp với 'path' bạn đã định nghĩa trong AdminRoutes.jsx
    icon: IconUsers, // Icon bạn muốn hiển thị
    breadcrumbs: false // (Tùy chọn)
};

export default usermanager;
