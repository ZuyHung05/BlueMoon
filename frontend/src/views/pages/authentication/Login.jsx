import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthLogin from '../auth-forms/AuthLogin';

export default function Login() {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Box sx={{ width: '100%' }}>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <AuthCardWrapper>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <Box sx={{ mb: 1 }}>
                                    <Link to="#" aria-label="logo">
                                        <Logo />
                                    </Link>
                                </Box>

                                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1, textAlign: 'center' }}>
                                    <Typography
                                        variant={downMD ? 'h3' : 'h2'}
                                        sx={{
                                            color: '#1565C0', // Màu Xanh Đậm
                                            fontWeight: 800,
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        Hệ thống quản lý chung cư BlueMoon
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '16px',
                                            fontWeight: 500
                                        }}
                                    >
                                        Nhập thông tin đăng nhập của bạn để tiếp tục
                                    </Typography>
                                </Stack>

                                <Box sx={{ width: '100%' }}>
                                    <AuthLogin />
                                </Box>
                            </Stack>
                        </AuthCardWrapper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <AuthFooter sx={{ color: 'white' }} />
                </Box>
            </Box>
        </AuthWrapper1>
    );
}
