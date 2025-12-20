import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { Users, TrendingUp } from 'lucide-react';

export default function TotalResidentsCard({ isLoading }) {
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
              <Typography variant="h6" sx={{ color: '#1B5E20' }}>
                Tổng số cư dân
              </Typography>

              <Typography variant="h3" fontWeight="bold" color="#2E7D32">
                128
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Cư dân đang cư trú hợp lệ
              </Typography>
            </Box>

            {/* Right side */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <Users size={40} color="#2E7D32" />

              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp size={18} color="green" style={{ marginRight: 4 }} />
                <Typography variant="caption" color="green">
                  +3 tháng này
                </Typography>
              </Box>
            </Box>

          </Box>
        )}
      </CardContent>
    </Card>
  );
}
