import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function ResolvedReportsCard({ isLoading }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        boxShadow: 2,
        borderRadius: 2
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={60} />
        ) : (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* Left side: content */}
            <Box>
              <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                Đã hoàn tất
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="#1B5E20">
                224
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sự cố đã được xử lý và xác nhận hoàn tất
              </Typography>
            </Box>

            {/* Right side: icon and trend */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <CheckCircleIcon sx={{ fontSize: 40, color: '#2E7D32' }} />
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon sx={{ fontSize: 18, color: 'green', mr: 0.5 }} />
                <Typography variant="caption" color="green">
                  +10 hôm nay
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
