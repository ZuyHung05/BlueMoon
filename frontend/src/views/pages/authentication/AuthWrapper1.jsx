// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
    // Gradient Xanh dương đậm đà (BlueMoon style)
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundSize: 'cover',
    position: 'relative',
    overflow: 'hidden'
}));

export default AuthWrapper1;
