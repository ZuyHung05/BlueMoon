import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import FormControl from '@mui/material/FormControl'; // Import FormControl chuẩn

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    // State loading
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true); // Bắt đầu loading

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            console.log("Đang gọi API tới:", apiUrl);

            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            console.log('Login success:', data);

            // Lưu token và role
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Điều hướng
            if (data.role === 'ADMIN') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/';
            }

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            setErrorMsg(err.message || "Không thể kết nối đến server. Vui lòng thử lại.");
            setIsLoading(false); // Tắt loading nếu có lỗi để người dùng nhập lại
        }
    };

    return (
        <>
            {/* --- HIỆU ỨNG LOADING TOÀN MÀN HÌNH --- */}
            <Backdrop
                sx={{ 
                    color: '#fff', 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: 'column',
                    gap: 2
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" size={60} thickness={4} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                    Đang đăng nhập...
                </Typography>
            </Backdrop>

            <form onSubmit={handleSubmit}>
                {/* Hiển thị lỗi nếu có */}
                <Collapse in={!!errorMsg}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                </Collapse>

                {/* --- INPUT USERNAME --- */}
                {/* Sử dụng FormControl chuẩn thay vì CustomFormControl bị lỗi */}
                <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
                    <InputLabel htmlFor="username-login">Username</InputLabel>
                    <OutlinedInput
                        id="username-login"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        label="Username"
                        disabled={isLoading} // Khóa input khi đang load
                        sx={{ borderRadius: '12px' }}
                        endAdornment={
                            <InputAdornment position="end">
                                <AccountCircle color={isLoading ? "disabled" : "primary"} />
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {/* --- INPUT PASSWORD --- */}
                <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <InputLabel htmlFor="password-login">Password</InputLabel>
                    <OutlinedInput
                        id="password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        label="Password"
                        disabled={isLoading} // Khóa input khi đang load
                        sx={{ borderRadius: '12px' }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {/* --- CHECKBOX --- */}
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={checked} 
                                    onChange={(e) => setChecked(e.target.checked)} 
                                    color="primary"
                                    disabled={isLoading} 
                                />
                            }
                            label={
                                <Typography variant="body2" color="textSecondary">
                                    Keep me logged in
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>

                {/* --- BUTTON --- */}
                <Box sx={{ mt: 2 }}>
                    {/* Loại bỏ AnimateButton bị lỗi, dùng Button chuẩn */}
                    <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        disabled={isLoading} // Khóa nút khi đang load
                        sx={{
                            borderRadius: '12px',
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            background: 'linear-gradient(to right, #1e3c72, #2a5298)',
                            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(to right, #2a5298, #1e3c72)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)'
                            }
                        }}
                    >
                        {isLoading ? 'Processing...' : 'Sign In'}
                    </Button>
                </Box>
            </form>
        </>
    );
}