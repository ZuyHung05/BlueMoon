import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// ==============================|| LOADER ||============================== //

export default function Loader() {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1199,
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <CircularProgress color="primary" />
        </Box>
    );
}
