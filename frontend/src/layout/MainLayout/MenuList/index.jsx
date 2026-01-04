import { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import menuItems from 'menu-items';

import { useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const { pathname } = useLocation();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const [selectedID, setSelectedID] = useState('');


  // --- [FIX QUAN TRỌNG] KIỂM TRA DỮ LIỆU ĐỂ KHÔNG CRASH ---
  // Nếu không có items, dừng render ngay lập tức
  if (!menuItems?.items) {
      return null; 
  }

  const lastItem = null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  // Xử lý logic cắt menu (nếu có)
  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && { url: item.url })
    }));
  }

  // --- [FIX QUAN TRỌNG] THÊM ?. VÀO VÒNG LẶP MAP ---
  const role = localStorage.getItem('role')?.toUpperCase() || 'GUEST';

  const filteredItems = menuItems.items.map((group) => {
      // 1. Filter children within the group
      if (group.children) {
          const filteredChildren = group.children.filter((item) => {
              if (!item.roles) return true; // No roles defined = visible to all
              return item.roles.includes(role);
          });
          
          // Return a new group object with filtered children
          return { ...group, children: filteredChildren };
      }
      return group;
  }).filter(group => group.children && group.children.length > 0); // Hide empty groups

  const navItems = filteredItems.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
              {index !== 0 && <Divider sx={{ py: 0.5 }} />}
            </List>
          );
        }
        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
            Menu Items Error
          </Typography>
        );
    }
  });

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>;
}

export default memo(MenuList);