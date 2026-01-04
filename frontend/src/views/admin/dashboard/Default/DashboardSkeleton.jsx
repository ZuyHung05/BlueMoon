import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export const DashboardSkeleton = () => {
    return (
        <>
            {/* Stat Cards Skeleton */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                {[1, 2, 3, 4].map((i) => (
                    <Box key={i} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                        <Card sx={{ height: '100%', borderRadius: 3 }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="60%" height={24} />
                                        <Skeleton variant="text" width="40%" height={48} sx={{ mt: 0.5 }} />
                                        <Skeleton variant="text" width="50%" height={20} sx={{ mt: 0.5 }} />
                                    </Box>
                                    <Skeleton variant="circular" width={56} height={56} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Stack>

            {/* Charts Skeleton */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
                {[1, 2].map((i) => (
                    <Box key={i} sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {[1, 2].map((i) => (
                    <Box key={i} sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Stack>
        </>
    );
};

export default DashboardSkeleton;
