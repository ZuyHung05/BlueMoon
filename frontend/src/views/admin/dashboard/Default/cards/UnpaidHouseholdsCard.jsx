import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha } from '@mui/material';
import { Wallet, TrendingUp } from 'lucide-react';

export default function UnpaidHouseholdsCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha('#E65100', 0.2)} 0%, ${alpha('#EF6C00', 0.15)} 100%)`
          : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        boxShadow: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          
          {/* Left */}
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#FFB74D' : '#E65100' }}>
              Hộ chưa thanh toán
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#FFCC80' : '#E65100' }}>
              32
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hộ còn nợ phí kỳ hiện tại
            </Typography>
          </Box>

          {/* Right */}
          <Box display="flex" alignItems="center" flexDirection="column">
            <Wallet size={40} color={isDark ? '#FFB74D' : '#EF6C00'} />
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp size={18} color="#FF7043" style={{ marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: '#FF7043' }}>
                +3 hôm nay
              </Typography>
            </Box>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
}

