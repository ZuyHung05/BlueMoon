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
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'user-welcome',
      title: 'Home',
      type: 'item',
      url: '/user/home',
      icon: icons.Home,
      breadcrumbs: false
    },
    {
      id: 'util-report_problem',
      title: 'Report Problem',
      type: 'item',
      url: '/user/report_problem',
      icon: icons.MessageCircleQuestion,
      breadcrumbs: false
    },
    {
      id: 'util-my_report',
      title: 'My Reports',
      type: 'item',
      url: '/user/my_report',
      icon: icons.FileText,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
