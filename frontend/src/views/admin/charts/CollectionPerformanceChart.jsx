import React from 'react';
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from '@mui/material';

const data = [
    { cycle: 'Tháng 10/2025', paid: 85, total: 100 },
    { cycle: 'Tháng 9/2025', paid: 92, total: 100 },
    { cycle: 'Tháng 8/2025', paid: 78, total: 100 },
    { cycle: 'Tháng 7/2025', paid: 88, total: 100 }
];

export default function CollectionPerformanceChart() {
    return (
        <Card
            sx={{
                height: '100%',
                minWidth: 0,
                flexGrow: 1,
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <CardContent sx={{ height: '100%', p: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Hiệu suất đợt thu
                </Typography>

                <Stack spacing={3} sx={{ mt: 2 }}>
                    {data.map((item, index) => (
                        <Box key={index}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {item.cycle}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ color: item.paid >= 90 ? '#22c55e' : item.paid >= 80 ? '#3b82f6' : '#f59e0b' }}>
                                    {item.paid}%
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={item.paid}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'action.hover',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        bgcolor: item.paid >= 90 ? '#22c55e' : item.paid >= 80 ? '#3b82f6' : '#f59e0b'
                                    }
                                }}
                            />
                        </Box>
                    ))}
                </Stack>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
                    <Stack direction="row" spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#22c55e' }} />
                            <Typography variant="caption" color="text.secondary">≥90%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#3b82f6' }} />
                            <Typography variant="caption" color="text.secondary">80-89%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#f59e0b' }} />
                            <Typography variant="caption" color="text.secondary">&lt;80%</Typography>
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
