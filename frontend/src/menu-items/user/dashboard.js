// assets
import { Home, MessageCircleQuestion, FileText } from 'lucide-react';

// constant
const icons = {
  Home,
  MessageCircleQuestion,
  FileText
};

// ==============================|| ACCOUNTANT DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Điều hướng',
  type: 'group',
  children: [
    {
      id: 'user-welcome',
      title: 'Trang chủ',
      type: 'item',
      url: '/user/home',
      icon: icons.Home,
      breadcrumbs: false
    },
    {
      id: 'util-report_problem',
      title: 'Báo cáo vấn đề',
      type: 'item',
      url: '/user/report_problem',
      icon: icons.MessageCircleQuestion,
      breadcrumbs: false
    },
    {
      id: 'util-my_report',
      title: 'Báo cáo của tôi',
      type: 'item',
      url: '/user/my_report',
      icon: icons.FileText,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
