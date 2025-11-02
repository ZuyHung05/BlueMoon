// assets
// Place to get icon: https://mui.com/material-ui/material-icons/?query=resident
import ApartmentIcon from '@mui/icons-material/Apartment';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AssessmentIcon from '@mui/icons-material/Assessment';

// constant
const icons = {
  ApartmentIcon,
  PaymentIcon,
  PeopleAltIcon,
  EngineeringIcon,
  AssessmentIcon
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
      url: '/residents',
      icon: icons.PeopleAltIcon,
      breadcrumbs: false
    },
    {
      id: 'util-apartment',
      title: 'Apartment',
      type: 'item',
      url: '/apartment',
      icon: icons.ApartmentIcon,
      breadcrumbs: false
    },
    {
      id: 'util-payments',
      title: 'Payments',
      type: 'item',
      url: '/payments',
      icon: icons.PaymentIcon,
      breadcrumbs: false
    },
    {
      id: 'util-maintenance',
      title: 'Maintenance',
      type: 'item',
      url: '/maintenance',
      icon: icons.EngineeringIcon,
      breadcrumbs: false
    },
    {
      id: 'util-reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: icons.AssessmentIcon,
      breadcrumbs: false
    }
  ]
};

export default utilities;
