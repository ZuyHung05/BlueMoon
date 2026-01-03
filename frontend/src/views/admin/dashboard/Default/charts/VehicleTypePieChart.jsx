import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

/**
 * Vehicle Type Distribution Pie Chart
 * Hiển thị tỷ lệ xe máy vs ô tô
 */
export default function VehicleTypePieChart({ data }) {
    const isDark = useTheme().palette.mode === 'dark';

    // Transform data for pie chart
    const chartData = data?.map(item => ({
        name: item.type,
        value: item.count,
        percent: item.percent,
        color: item.color
    })) || [];

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
                        {payload[0].name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: payload[0].payload.color }}>
                        Số lượng: {payload[0].value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: payload[0].payload.color }}>
                        Tỷ lệ: {payload[0].payload.percent}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    const totalVehicles = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <MainCard
            title="Thống kê phương tiện"
            contentSX={{ p: 2.5 }}
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tỷ lệ xe máy và ô tô đã đăng ký
            </Typography>

            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${percent}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        formatter={(value, entry) => (
                            <Typography variant="caption">
                                {value} ({entry.payload.value})
                            </Typography>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Summary */}
            <Box sx={{
                mt: 2,
                p: 2,
                bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)',
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant="body2" fontWeight={600}>
                    Tổng số phương tiện
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#3b82f6">
                    {totalVehicles}
                </Typography>
            </Box>
        </MainCard>
    );
}
