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
      id: 'util-resident',
      title: 'Residents',
      type: 'item',
      url: '/manager/resident',
      icon: icons.PeopleAltIcon,
      breadcrumbs: false
    },
    {
      id: 'util-household',
      title: 'Household',
      type: 'item',
      url: '/manager/household',
      icon: icons.ApartmentIcon,
      breadcrumbs: false
    }
  ]
};

export default utilities;
