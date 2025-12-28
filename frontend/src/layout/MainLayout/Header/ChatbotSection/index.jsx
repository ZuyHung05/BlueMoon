import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { Headset } from 'lucide-react';

// ==============================|| CHATBOT TOGGLE SECTION ||============================== //

export default function ChatbotSection({ toggled, handleToggle }) {
    const theme = useTheme();

    return (
        <Tooltip title="Trợ lý ảo">
            <Badge
                badgeContent={1}
                color="error"
                sx={{
                    '& .MuiBadge-badge': {
                        right: 4,
                        top: 4,
                        border: `2px solid ${theme.palette.background.paper}`,
                        padding: '0 4px'
                    }
                }}
            >
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        overflow: 'hidden',
                        transition: 'all .2s ease-in-out',
                        color: theme.vars.palette.secondary.main,
                        background: `${theme.vars.palette.secondary.main}20`,
                        border: `1px solid`,
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': {
                            color: theme.vars.palette.secondary.light,
                            background: `${theme.vars.palette.secondary.main}35`,
                            boxShadow: `0 0 8px ${theme.vars.palette.secondary.main}40`
                        }
                    }}
                    onClick={handleToggle}
                >
                    <Headset strokeWidth={1.5} size="20px" />
                </Avatar>
            </Badge>
        </Tooltip>
    );
}
