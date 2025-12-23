// assets
import { Users, Building2 } from 'lucide-react';

// constant
const icons = {
  Users,
  Building2
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
      icon: icons.Users,
      breadcrumbs: false
    },
    {
      id: 'util-household',
      title: 'Household',
      type: 'item',
      url: '/manager/household',
      icon: icons.Building2,
      breadcrumbs: false
    }
  ]
};

export default utilities;
