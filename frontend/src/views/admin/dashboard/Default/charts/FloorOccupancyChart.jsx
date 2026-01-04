import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

/**
 * Floor Occupancy Bar Chart
 * Hiển thị mật độ cư trú theo tầng dưới dạng biểu đồ cột
 */
export default function FloorOccupancyChart({ data }) {
    const isDark = useTheme().palette.mode === 'dark';

    // Transform data for chart
    const chartData = data?.map(item => ({
        floor: item.floorRange,
        percent: item.usedPercent,
        label: `${item.usedPercent}%`
    })) || [];

    // Color based on occupancy percentage
    const getBarColor = (percent) => {
        if (percent >= 90) return '#ef4444'; // Red - Very high
        if (percent >= 75) return '#f59e0b'; // Orange - High
        if (percent >= 50) return '#22c55e'; // Green - Medium
        return '#3b82f6'; // Blue - Low
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        bgcolor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {payload[0].payload.floor}
                    </Typography>
                    <Typography variant="body2" sx={{ color: payload[0].fill }}>
                        Tỷ lệ sử dụng: {payload[0].value}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <MainCard
            title="Mật độ cư trú theo tầng"
            contentSX={{ p: 2.5 }}
        >
            <ResponsiveContainer width="100%" height={280}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                    />
                    <XAxis
                        dataKey="floor"
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
                    />
                    <YAxis
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
                        label={{
                            value: 'Tỷ lệ sử dụng (%)',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }
                        }}
                        domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                    <Bar
                        dataKey="percent"
                        radius={[8, 8, 0, 0]}
                        label={{
                            position: 'top',
                            fill: isDark ? '#fff' : '#000',
                            fontSize: 11,
                            fontWeight: 600
                        }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.percent)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#3b82f6', borderRadius: 1 }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}>
                        Thấp (&lt;50%)
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', borderRadius: 1 }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}>
                        Trung bình (50-75%)
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#f59e0b', borderRadius: 1 }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}>
                        Cao (75-90%)
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', borderRadius: 1 }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}>
                        Rất cao (≥90%)
                    </Typography>
                </Box>
            </Box>
        </MainCard>
    );
}
