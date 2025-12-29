// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import ThemeModeSection from './ThemeModeSection';
import ChatbotSection from './ChatbotSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { Menu } from 'lucide-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header({ chatToggled, handleChatToggle }) {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    return (
        <>
            {/* logo & toggler button */}
            <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        overflow: 'hidden',
                        transition: 'all .2s ease-in-out',
                        color: theme.vars.palette.primary.main,
                        background: `${theme.vars.palette.primary.main}20`,
                        border: `1px solid`,
                        borderColor: 'divider',
                        '&:hover': {
                            color: theme.vars.palette.primary.light,
                            background: `${theme.vars.palette.primary.main}35`,
                            boxShadow: `0 0 8px ${theme.vars.palette.primary.main}40`
                        }
                    }}
                    onClick={() => handlerDrawerOpen(!drawerOpen)}
                    onMouseEnter={() => handlerDrawerOpen(true)}
                >
                    <Menu strokeWidth={1.5} size="20px" />
                </Avatar>
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* chatbot toggle */}
            <Box sx={{ mr: 1 }}>
                <ChatbotSection toggled={chatToggled} handleToggle={handleChatToggle} />
            </Box>

            {/* theme mode toggle */}
            <Box sx={{ mr: 1 }}>
                <ThemeModeSection />
            </Box>

            {/* profile / logout */}
            <ProfileSection />
        </>
    );
}

