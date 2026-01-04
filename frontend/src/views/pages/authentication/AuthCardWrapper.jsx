import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

export default function AuthCardWrapper({ children, ...other }) {
    return (
        <MainCard
            sx={{
                maxWidth: { xs: 400, lg: 480 },
                margin: { xs: 2.5, md: 3 },
                '& > *': {
                    flexGrow: 1,
                    flexBasis: '50%'
                },
                // --- STYLE MỚI ---
                borderRadius: '24px', // Bo góc tròn hơn
                boxShadow: '0px 20px 50px rgba(0,0,0,0.3)', // Đổ bóng sâu hơn
                border: '1px solid rgba(255, 255, 255, 0.2)', // Viền sáng nhẹ
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Nền trắng trong suốt
                backdropFilter: 'blur(20px)', // Hiệu ứng mờ kính
                overflow: 'visible' // Để các hiệu ứng shadow không bị cắt
            }}
            content={false}
            {...other}
        >
            <Box sx={{ p: { xs: 3, sm: 4, xl: 5 } }}>{children}</Box>
        </MainCard>
    );
}

AuthCardWrapper.propTypes = { children: PropTypes.any, other: PropTypes.any };
