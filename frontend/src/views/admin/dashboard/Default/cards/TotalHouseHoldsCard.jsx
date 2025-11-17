import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function TotalHouseholdsCard({ isLoading }) {
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
            
            {/* Left */}
            <Box>
              <Typography variant="h6" sx={{ color: '#0D47A1' }}>
                Tổng số hộ gia đình
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="#1565C0">
                342
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hộ đang sinh sống tại chung cư
              </Typography>
            </Box>

            {/* Right */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <HomeWorkIcon sx={{ fontSize: 40, color: '#1976D2' }} />
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon sx={{ fontSize: 18, color: 'green', mr: 0.5 }} />
                <Typography variant="caption" color="green">
                  +5 hộ mới
                </Typography>
              </Box>
            </Box>

          </Box>
        )}
      </CardContent>
    </Card>
  );
}