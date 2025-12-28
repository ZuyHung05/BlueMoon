import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from '@mui/material';

// project imports
import Loader from 'ui-component/Loader';

// assets
import { LogOut } from 'lucide-react';

// ==============================|| LOGOUT BUTTON ||============================== //

export default function ProfileSection() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogoutClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmLogout = () => {
        setOpen(false);
        setIsLoggingOut(true);

        // Giả lập delay một chút để hiện spinner (nếu xử lý nhanh quá) 
        // hoặc đơn giản là đợi quá trình clear/navigate
        setTimeout(() => {
            // Xóa token và thông tin user
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');

            // Chuyển hướng về trang login
            navigate('/login', { replace: true });
            window.location.reload(); // Reload để reset state app
        }, 800);
    };

    return (
        <>
            {isLoggingOut && <Loader />}
            <Button
                variant="outlined"
                onClick={handleLogoutClick}
                startIcon={<LogOut size={18} />}
                sx={{
                    ml: 2,
                    borderRadius: '27px',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    padding: '6px 16px',
                    '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: theme.palette.primary.lighter
                    }
                }}
            >
                Đăng xuất
            </Button>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        minWidth: '320px'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    Xác nhận đăng xuất
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="body1">
                            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmLogout} 
                        variant="contained" 
                        color="error"
                        autoFocus
                        sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
                    >
                        Đăng xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
