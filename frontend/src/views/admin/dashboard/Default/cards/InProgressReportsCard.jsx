import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

export default function InProgressReportsCard({ isLoading }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        boxShadow: 2,
        borderRadius: 2
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={60} />
        ) : (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* Left side: text content */}
            <Box>
              <Typography variant="h6" sx={{ color: '#0D47A1' }}>
                Đang xử lý
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                78
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sự cố đang được đội kỹ thuật xử lý
              </Typography>
            </Box>

            {/* Right side: icon + trend */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <BuildCircleIcon sx={{ fontSize: 40, color: '#1565C0' }} />
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon sx={{ fontSize: 18, color: 'green', mr: 0.5 }} />
                <Typography variant="caption" color="green">
                  +5 hôm nay
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
