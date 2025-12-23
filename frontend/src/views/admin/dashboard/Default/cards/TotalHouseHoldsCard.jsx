import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function TotalHouseholdsCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha('#1976D2', 0.2)} 0%, ${alpha('#1565C0', 0.15)} 100%)`
          : 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        boxShadow: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          
          {/* Left */}
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#64B5F6' : '#0D47A1' }}>
              Tổng số hộ gia đình
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#90CAF9' : '#1565C0' }}>
              342
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hộ đang sinh sống tại chung cư
            </Typography>
          </Box>

          {/* Right */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <HomeWorkIcon sx={{ fontSize: 40, color: isDark ? '#64B5F6' : '#1976D2' }} />
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUpIcon sx={{ fontSize: 18, color: '#4CAF50', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                +5 hộ mới
              </Typography>
            </Box>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
}

