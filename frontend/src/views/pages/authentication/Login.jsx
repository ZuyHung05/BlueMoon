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
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <Typography
                                    variant={downMD ? 'h3' : 'h2'}
                                    sx={{
                                        color: theme.palette.primary.main,
                                        fontWeight: 800,
                                        letterSpacing: '0.5px',
                                        textAlign: 'center'
                                    }}
                                >
                                    Hệ thống quản lý chung cư
                                </Typography>

                                <Box sx={{ mb: 0.5 }}>
                                    <Link to="#" aria-label="logo">
                                        <Logo />
                                    </Link>
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#333333',
                                        fontSize: '15px', // Slightly smaller text
                                        fontWeight: 500,
                                        textAlign: 'center'
                                    }}
                                >
                                    Nhập thông tin đăng nhập của bạn để tiếp tục
                                </Typography>

                                <Box sx={{ width: '100%' }}>
                                    <AuthLogin />
                                </Box>
                            </Stack>
                        </AuthCardWrapper>
                    </Grid>
                </Grid>


            </Box>
        </AuthWrapper1>
    );
}
