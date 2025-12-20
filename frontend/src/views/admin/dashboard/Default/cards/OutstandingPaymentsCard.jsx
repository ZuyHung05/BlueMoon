import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export default function OutstandingPaymentsCard({ isLoading }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
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
              <Typography variant="h6" sx={{ color: '#C62828' }}>
                Hộ còn nợ phí
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="#B71C1C">
                12
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hộ chưa thanh toán trong kỳ hiện tại
              </Typography>
            </Box>

            {/* Right */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <AlertTriangle size={40} color="#D32F2F" />
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp size={18} color="#D32F2F" style={{ marginRight: 4 }} />
                <Typography variant="caption" color="#D32F2F">
                  +2 hôm nay
                </Typography>
              </Box>
            </Box>

          </Box>
        )}
      </CardContent>
    </Card>
  );
}