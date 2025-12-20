import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import useConfig from 'hooks/useConfig';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function NavItem({ item, level, isParents = false, setSelectedID }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);

  const { pathname } = useLocation();
  const {
    state: { borderRadius }
  } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);

  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    window.removeEventListener('resize', compareSize);
  }, []);

  const Icon = item?.icon;
  const itemIcon = item?.icon ? (
    <Icon
      strokeWidth={1.5}
      size={drawerOpen ? 20 : 24}
      color="#22d3ee" // Cyan 400
      style={{
        filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.8))', // Neon glow
        ...(isParents && { fontSize: 20, strokeWidth: 1.5 })
      }}
      className="animate-pulse" // Pulse animation
    />
  ) : (
    <FiberManualRecordIcon sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }} fontSize={level > 0 ? 'inherit' : 'medium'} />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = () => {
    if (downMD) handlerDrawerOpen(false);

    if (isParents && setSelectedID) {
      setSelectedID();
    }
  };

  return (
    <>
      <ListItemButton
        component={Link}
        to={item.url}
        target={itemTarget}
        disabled={item.disabled}
        disableRipple={!drawerOpen}
        sx={{
          zIndex: 1201,
          borderRadius: `12px`, // Modern rounded corners
          mb: 0.5,
          position: 'relative', // For the indicator strip
          mx: 1, // Add margin on x-axis
          ...(drawerOpen && level !== 1 && { ml: `${level * 18}px` }),
          // ...(!drawerOpen && { pl: 1.25 }), // Removed specific pl for general px
          ...((!drawerOpen || level !== 1) && {
            py: 1.25,
            '&:hover': {
              bgcolor: 'primary.lighter',
              color: 'primary.main'
            },
            '&.Mui-selected': {
              color: 'primary.main',
              bgcolor: drawerOpen ? 'primary.light' : 'transparent', // No bg on button if collapsed (icon handles it)
              borderLeft: 'none',
              
              // Active Indicator (Only when open)
              ...(drawerOpen && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '60%',
                  width: '4px',
                  backgroundColor: 'primary.main',
                  borderRadius: '0 4px 4px 0'
                }
              }),
              
              '&:hover': {
                bgcolor: drawerOpen ? 'primary.light' : 'transparent',
                ...(drawerOpen && {
                    '&::before': {
                        backgroundColor: 'primary.dark'
                    }
                })
              },
              '& .MuiListItemIcon-root': {
                 color: 'primary.main'
              }
            }
          }),
          // Centering for collapsed state
          ...(!drawerOpen && {
             justifyContent: 'center',
             px: 0
          })
        }}
        selected={isSelected}
        onClick={() => itemHandler()}
      >
        <ButtonBase aria-label="theme-icon" sx={{ borderRadius: `12px` }} disableRipple={drawerOpen}>
          <ListItemIcon
            sx={{
              minWidth: level === 1 ? 36 : 18,
              color: isSelected ? 'primary.main' : 'text.secondary', // Use primary for active
              ...(!drawerOpen &&
                level === 1 && {
                  borderRadius: `12px`,
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { bgcolor: 'primary.lighter', color: 'primary.main' },
                  ...(isSelected && {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.light' }
                  })
                })
            }}
          >
            {itemIcon}
          </ListItemIcon>
        </ButtonBase>

        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <Tooltip title={item.title} disableHoverListener={!hoverStatus}>
            <ListItemText
              primary={
                <Typography
                  ref={ref}
                  noWrap
                  variant={isSelected ? 'h5' : 'body1'}
                  sx={{
                    width: 'auto', // Allow full width
                    color: 'inherit',
                    fontWeight: isSelected ? 600 : 400, // Thicker font for selected
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </Typography>
              }
              secondary={
                item.caption && (
                  <Typography
                    variant="caption"
                    gutterBottom
                    sx={{
                      display: 'block',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      textTransform: 'capitalize',
                      lineHeight: 1.66
                    }}
                  >
                    {item.caption}
                  </Typography>
                )
              }
            />
          </Tooltip>
        )}

        {drawerOpen && item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </ListItemButton>
    </>
  );
}

NavItem.propTypes = { item: PropTypes.any, level: PropTypes.number, isParents: PropTypes.bool, setSelectedID: PropTypes.func };
