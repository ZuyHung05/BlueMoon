// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-residents',
      title: '👥 Residents',
      type: 'item',
      url: '/residents',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'util-apartment',
      title: '🏢 Apartment',
      type: 'item',
      url: '/apartment',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
    {
      id: 'util-payments',
      title: '💰 Payments',
      type: 'item',
      url: '/payments',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
    {
      id: 'util-maintenance',
      title: '🛠️ Maintenance',
      type: 'item',
      url: '/maintenance',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
    {
      id: 'util-reports',
      title: '🧾 Reports',
      type: 'item',
      url: '/reports',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
    {
      id: 'util-payments',
      title: 'Payments',
      type: 'item',
      url: '/payments',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
  ]
};

export default utilities;
