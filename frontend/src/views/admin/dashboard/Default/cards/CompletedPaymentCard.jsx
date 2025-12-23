import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha } from '@mui/material';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function CompletedPaymentsCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha('#2E7D32', 0.2)} 0%, ${alpha('#1B5E20', 0.15)} 100%)`
          : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        boxShadow: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">

          {/* Left side */}
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#81C784' : '#2E7D32' }}>
              Hộ đã thanh toán
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#A5D6A7' : '#1B5E20' }}>
              224
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hộ đã hoàn tất thanh toán trong kỳ này
            </Typography>
          </Box>

          {/* Right side */}
          <Box display="flex" alignItems="center" flexDirection="column">
            <CheckCircle2 size={40} color={isDark ? '#81C784' : '#2E7D32'} />
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp size={18} color="#4CAF50" style={{ marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                +10 hôm nay
              </Typography>
            </Box>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
}

