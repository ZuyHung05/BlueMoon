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
import FormControl from '@mui/material/FormControl';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CheckCircle from '@mui/icons-material/CheckCircle';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    // State loading & success
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true); // Bắt đầu loading

        try {
            const apiUrl = import.meta.env.VITE_API_URL;

            console.log("DEBUG: Sending login request to:", `${apiUrl}/api/login`);
            console.log("DEBUG: Payload:", { username: formData.username, password: formData.password });

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

            // Lưu token và role
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Bật trạng thái thành công để hiện tích xanh
            setIsSuccess(true);

            // Đợi một chút để người dùng thấy thông báo thành công (đánh lừa thị giác)
            setTimeout(() => {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    window.location.href = '/';
                }
            }, 1500);

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            setErrorMsg(err.message || "Không thể kết nối đến server. Vui lòng thử lại.");
            setIsLoading(false); // Tắt loading nếu có lỗi để người dùng nhập lại
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {/* --- HIỆU ỨNG THÀNH CÔNG TRONG CARD (GLASSMORPISM) --- */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: { xs: -140, sm: -160 }, // Đẩy ngược lên để che phủ luôn cả Logo và Title
                        left: { xs: -24, sm: -32 },  // Che phủ padding của AuthCardWrapper
                        right: { xs: -24, sm: -32 },
                        bottom: { xs: -24, sm: -32 },
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '24px', // Khớp với AuthCardWrapper
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'center'
                    }}
                >
                    {!isSuccess ? (
                        <>
                            <CircularProgress sx={{ color: '#1e3c72' }} size={60} thickness={4} />
                            <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: '#1e3c72', opacity: 0.9 }}>
                                Đang xác thực thông tin...
                            </Typography>
                        </>
                    ) : (
                        <Box sx={{ 
                            animation: 'fadeInScale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <CheckCircle sx={{ fontSize: 110, color: '#00c853', mb: 2 }} />
                            <Typography variant="h3" sx={{ 
                                fontWeight: 900, 
                                color: '#1b5e20', // Darker green for text for better readability
                                mb: 1.5,
                                letterSpacing: '-0.5px'
                            }}>
                                Đăng nhập thành công!
                            </Typography>
                            <Typography variant="h5" sx={{ 
                                color: '#00c853', 
                                fontWeight: 600,
                                opacity: 1,
                                letterSpacing: '0.2px',
                                animation: 'blink 1.5s infinite'
                            }}>
                                Đang chuyển hướng...
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            <style>
                {`
                    @keyframes fadeInScale {
                        0% { transform: scale(0.6); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}
            </style>

            <form onSubmit={handleSubmit}>
                {/* Hiển thị lỗi nếu có */}
                <Collapse in={!!errorMsg}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                </Collapse>

                {/* --- INPUT USERNAME --- */}
                <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <Typography variant="subtitle1" sx={{ color: '#000000', mb: 0.5, fontWeight: 600 }}>
                        Tên người dùng
                    </Typography>
                    <OutlinedInput
                        id="username-login"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Nhập tên người dùng"
                        disabled={isLoading}
                        inputProps={{
                            spellCheck: 'false',
                            autoCapitalize: 'none'
                        }}
                        sx={{ 
                            borderRadius: '12px', 
                            backgroundColor: '#ffffff',
                            '& .MuiOutlinedInput-input': { 
                                color: '#000000',
                                padding: '12px 14px', // Slightly reduced padding
                                '&:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important',
                                    transition: 'background-color 5000s ease-in-out 0s'
                                },
                                '&:-webkit-autofill:hover': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important'
                                },
                                '&:-webkit-autofill:focus': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important'
                                },
                                '&:-webkit-autofill:active': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important'
                                }
                            },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <AccountCircle color={isLoading ? "disabled" : "primary"} />
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {/* --- INPUT PASSWORD --- */}
                <FormControl fullWidth sx={{ mb: 1.5 }} variant="outlined">
                    <Typography variant="subtitle1" sx={{ color: '#000000', mb: 0.5, fontWeight: 600 }}>
                        Mật khẩu
                    </Typography>
                    <OutlinedInput
                        id="password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Nhập mật khẩu"
                        disabled={isLoading}
                        inputProps={{
                            spellCheck: 'false'
                        }}
                        sx={{ 
                            borderRadius: '12px', 
                            backgroundColor: '#ffffff',
                            '& .MuiOutlinedInput-input': { 
                                color: '#000000',
                                padding: '12px 14px', // Slightly reduced padding
                                '&:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important',
                                    transition: 'background-color 5000s ease-in-out 0s'
                                },
                                '&:-webkit-autofill:hover': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important'
                                },
                                '&:-webkit-autofill:focus': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important'
                                },
                                '&:-webkit-autofill:active': {
                                    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                                    WebkitTextFillColor: '#000000 !important'
                                }
                            },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <Visibility color="primary" /> : <VisibilityOff color="primary" />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {/* --- CHECKBOX --- */}
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
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
                                <Typography variant="body2" sx={{ color: '#000000' }}>
                                    Ghi nhớ đăng nhập
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>



                {/* --- BUTTON --- */}
                <Box sx={{ mt: 1 }}>
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
                            py: 1.2, // Reduced padding vertical
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            background: 'linear-gradient(to right, #1e3c72, #2a5298)',
                            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                            color: '#ffffff', // Màu trắng để đối lập với nền xanh đậm
                            '&:hover': {
                                background: 'linear-gradient(to right, #2a5298, #1e3c72)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)'
                            }
                        }}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}