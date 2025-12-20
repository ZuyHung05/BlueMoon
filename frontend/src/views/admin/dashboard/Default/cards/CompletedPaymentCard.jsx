import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function CompletedPaymentsCard({ isLoading }) {
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

            {/* Left side */}
            <Box>
              <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                Hộ đã thanh toán
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="#1B5E20">
                224
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hộ đã hoàn tất thanh toán trong kỳ này
              </Typography>
            </Box>

            {/* Right side */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <CheckCircle2 size={40} color="#2E7D32" />
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp size={18} color="green" style={{ marginRight: 4 }} />
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