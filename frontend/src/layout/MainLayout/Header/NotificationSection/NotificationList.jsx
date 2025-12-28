import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';

function ListItemWrapper({ children }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: withAlpha(theme.palette.grey[200], 0.3)
                }
            }}
        >
            {children}
        </Box>
    );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList() {
    const containerSX = { gap: 2, pl: 7 };

    return (
        <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
            <ListItemWrapper>
                <ListItem
                    alignItems="center"
                    disablePadding
                    secondaryAction={
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="caption">2 phút trước</Typography>
                        </Stack>
                    }
                >
                    <ListItemAvatar>
                        <Avatar alt="John Doe" src={User1} />
                    </ListItemAvatar>
                    <ListItemText primary="Nguyễn Văn A" />
                </ListItem>
                <Stack sx={containerSX}>
                    <Typography variant="subtitle2">Đã thanh toán phí quản lý tháng 12/2025</Typography>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                        <Chip label="Chưa đọc" color="error" size="small" sx={{ width: 'min-content' }} />
                        <Chip label="Mới" color="warning" size="small" sx={{ width: 'min-content' }} />
                    </Stack>
                </Stack>
            </ListItemWrapper>
            <ListItemWrapper>
                <ListItem
                    alignItems="center"
                    disablePadding
                    secondaryAction={
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="caption">2 phút trước</Typography>
                        </Stack>
                    }
                >
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: 'success.dark',
                                bgcolor: 'success.light'
                            }}
                        >
                            <IconBuildingStore stroke={1.5} size="20px" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Xác minh cửa hàng hoàn tất</Typography>} />
                </ListItem>
                <Stack sx={containerSX}>
                    <Typography variant="subtitle2">Chúng tôi đã nhận được yêu cầu của bạn.</Typography>
                    <Chip label="Chưa đọc" color="error" size="small" sx={{ width: 'min-content' }} />
                </Stack>
            </ListItemWrapper>
            <ListItemWrapper>
                <ListItem
                    alignItems="center"
                    disablePadding
                    secondaryAction={
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="caption">2 phút trước</Typography>
                        </Stack>
                    }
                >
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: 'primary.dark',
                                bgcolor: 'primary.light'
                            }}
                        >
                            <IconMailbox stroke={1.5} size="20px" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Kiểm tra Email.</Typography>} />
                </ListItem>
                <Stack sx={containerSX}>
                    <Typography variant="subtitle2">Xong! Kiểm tra hộp thư đến để nhận quà!</Typography>
                    <Button variant="contained" endIcon={<IconBrandTelegram stroke={1.5} size={20} />} sx={{ width: 'min-content' }}>
                        Mail
                    </Button>
                </Stack>
            </ListItemWrapper>
            <ListItemWrapper>
                <ListItem
                    alignItems="center"
                    disablePadding
                    secondaryAction={
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="caption">2 phút trước</Typography>
                        </Stack>
                    }
                >
                    <ListItemAvatar>
                        <Avatar alt="John Doe" src={User1} />
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Trần Thị B</Typography>} />
                </ListItem>
                <Stack sx={containerSX}>
                    <Typography component="span" variant="subtitle2">
                        Đã tải lên 2 tệp vào &nbsp;
                        <Typography component="span" variant="h6">
                            21 Jan 2025
                        </Typography>
                    </Typography>
                    <Card sx={{ bgcolor: 'secondary.light' }}>
                        <Stack direction="row" sx={{ p: 2.5, gap: 2 }}>
                            <IconPhoto stroke={1.5} size="20px" />
                            <Typography variant="subtitle1">demo.jpg</Typography>
                        </Stack>
                    </Card>
                </Stack>
            </ListItemWrapper>
            <ListItemWrapper>
                <ListItem
                    alignItems="center"
                    disablePadding
                    secondaryAction={
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="caption">2 phút trước</Typography>
                        </Stack>
                    }
                >
                    <ListItemAvatar>
                        <Avatar alt="John Doe" src={User1} />
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Lê Văn C</Typography>} />
                </ListItem>
                <Stack sx={containerSX}>
                    <Typography variant="subtitle2">Đang xử lý yêu cầu thay đổi nhân khẩu...</Typography>
                    <Chip label="Xác nhận tài khoản" color="success" size="small" sx={{ width: 'min-content' }} />
                </Stack>
            </ListItemWrapper>
        </List>
    );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
