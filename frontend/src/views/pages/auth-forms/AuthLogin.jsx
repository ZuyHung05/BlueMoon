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
import Alert from '@mui/material/Alert'; // Thêm Alert
import Collapse from '@mui/material/Collapse'; // Thêm hiệu ứng

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(''); // State lưu thông báo lỗi

    // [THAY ĐỔI 1] Khởi tạo state dùng 'username'
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            // [THAY ĐỔI 2] Gửi key 'username' lên Backend
            const response = await fetch('http://localhost:8080/api/login', {
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
                // Hiển thị lỗi từ backend (ví dụ: Sai mật khẩu, không phải Admin)
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            console.log('Login success:', data);

            // Lưu token và role
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role); // Backend trả về role trong response

            // Điều hướng
            if (data.role === 'ADMIN') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Hiển thị lỗi nếu có */}
            <Collapse in={!!errorMsg}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMsg}
                </Alert>
            </Collapse>

            {/* --- INPUT USERNAME (ĐÃ SỬA) --- */}
            <CustomFormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel htmlFor="username-login">Username</InputLabel>
                <OutlinedInput
                    id="username-login"
                    type="text" // [THAY ĐỔI 3] Dùng text thay vì email
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    label="Username"
                    sx={{ borderRadius: '12px' }}
                    endAdornment={
                        <InputAdornment position="end">
                            <AccountCircle color="primary" />
                        </InputAdornment>
                    }
                />
            </CustomFormControl>

            {/* --- INPUT PASSWORD --- */}
            <CustomFormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    label="Password"
                    sx={{ borderRadius: '12px' }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </CustomFormControl>

            {/* --- CHECKBOX --- */}
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />}
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
                <AnimateButton>
                    <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
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
                        Sign In
                    </Button>
                </AnimateButton>
            </Box>
        </form>
    );
}
