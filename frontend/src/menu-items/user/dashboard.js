// assets
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssessmentIcon from '@mui/icons-material/Assessment';

// constant
const icons = { HomeFilledIcon,
  QuestionAnswerIcon,
  AssessmentIcon
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
      icon: icons.HomeFilledIcon,
      breadcrumbs: false
    },
    {
      id: 'util-report_problem',
      title: 'Report Problem',
      type: 'item',
      url: '/user/report_problem',
      icon: icons.QuestionAnswerIcon,
      breadcrumbs: false
    },
    {
      id: 'util-my_report',
      title: 'My Reports',
      type: 'item',
      url: '/user/my_report',
      icon: icons.AssessmentIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
