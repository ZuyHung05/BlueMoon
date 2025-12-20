import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { Building2, TrendingUp } from 'lucide-react';

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

            {/* Left side */}
            <Box>
              <Typography variant="h6" sx={{ color: '#0D47A1' }}>
                Tổng số hộ khẩu
              </Typography>

              <Typography variant="h3" fontWeight="bold" color="#1565C0">
                42
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Hộ đang quản lý trong khu vực
              </Typography>
            </Box>

            {/* Right side */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <Building2 size={40} color="#1976D2" />

              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp size={18} color="green" style={{ marginRight: 4 }} />
                <Typography variant="caption" color="green">
                  +1 hôm nay
                </Typography>
              </Box>
            </Box>

          </Box>
        )}
      </CardContent>
    </Card>
  );
}
