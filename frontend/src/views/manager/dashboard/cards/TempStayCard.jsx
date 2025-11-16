import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function TempStayCard({ isLoading }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
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
              <Typography variant="h6" sx={{ color: '#E65100' }}>
                Tạm trú / Tạm vắng
              </Typography>

              <Typography variant="h3" fontWeight="bold" color="#EF6C00">
                5
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Số cư dân đang khai báo trong khu vực
              </Typography>
            </Box>

            {/* Right side */}
            <Box display="flex" alignItems="center" flexDirection="column">
              <AssignmentIndIcon sx={{ fontSize: 40, color: '#FB8C00' }} />

              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon sx={{ fontSize: 18, color: '#EF6C00', mr: 0.5 }} />
                <Typography variant="caption" color="#EF6C00">
                  +1 tuần này
                </Typography>
              </Box>
            </Box>

          </Box>
        )}
      </CardContent>
    </Card>
  );
}
