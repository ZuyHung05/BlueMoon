import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function UnpaidHouseholdsCard({ isLoading }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        boxShadow: 2,
        borderRadius: 2
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={60} />
        ) : (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            
            {/* Left */}
            <Box>
              <Typography variant="h6" sx={{ color: '#E65100' }}>
                Hộ chưa thanh toán
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#E65100' }}>
                32
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hộ còn nợ phí kỳ hiện tại
              </Typography>
            </Box>

            {/* Right */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#EF6C00' }} />
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon sx={{ fontSize: 18, color: 'red', mr: 0.5 }} />
                <Typography variant="caption" color="red">
                  +3 hôm nay
                </Typography>
              </Box>
            </Box>

          </Box>
        )}
      </CardContent>
    </Card>
  );
}
