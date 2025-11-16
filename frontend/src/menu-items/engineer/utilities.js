// assets
// Place to get icon: https://mui.com/material-ui/material-icons/?query=resident
import ApartmentIcon from '@mui/icons-material/Apartment';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
// constant
const icons = {
  ApartmentIcon,
  PaymentIcon,
  PeopleAltIcon,
  EngineeringIcon,
  AssessmentIcon,
  ShowChartIcon
};


const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
   
    {
      id: 'util-my_task',
      title: 'My Task',
      type: 'item',
      url: '/engineer/my_task',
      icon: icons.ShowChartIcon,
      breadcrumbs: false
    },
    {
      id: 'util-task_update',
      title: 'Task Updates',
      type: 'item',
      url: '/engineer/task_update',
      icon: icons.EngineeringIcon,
      breadcrumbs: false
    },
    {
      id: 'util-history',
      title: 'History',
      type: 'item',
      url: '/engineer/history',
      icon: icons.AssessmentIcon,
      breadcrumbs: false
    }
  ]
};

export default utilities;
