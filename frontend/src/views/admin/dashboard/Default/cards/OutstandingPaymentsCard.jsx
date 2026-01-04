import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha } from '@mui/material';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export default function OutstandingPaymentsCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha('#C62828', 0.2)} 0%, ${alpha('#B71C1C', 0.15)} 100%)`
          : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
        boxShadow: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">

          {/* Left */}
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#EF9A9A' : '#C62828' }}>
              Hộ còn nợ phí
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#FFCDD2' : '#B71C1C' }}>
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hộ chưa thanh toán trong kỳ hiện tại
            </Typography>
          </Box>

          {/* Right */}
          <Box display="flex" alignItems="center" flexDirection="column">
            <AlertTriangle size={40} color={isDark ? '#EF9A9A' : '#D32F2F'} />
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp size={18} color="#EF5350" style={{ marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: '#EF5350' }}>
                +2 hôm nay
              </Typography>
            </Box>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
}

