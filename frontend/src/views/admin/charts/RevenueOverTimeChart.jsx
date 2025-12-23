import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'T1', revenue: 45000000 },
    { name: 'T2', revenue: 52000000 },
    { name: 'T3', revenue: 48000000 },
    { name: 'T4', revenue: 62000000 },
    { name: 'T5', revenue: 73000000 },
    { name: 'T6', revenue: 81000000 },
    { name: 'T7', revenue: 76000000 },
    { name: 'T8', revenue: 88000000 },
    { name: 'T9', revenue: 94000000 },
    { name: 'T10', revenue: 102000000 },
    { name: 'T11', revenue: 97000000 },
    { name: 'T12', revenue: 115000000 }
];

export default function RevenueOverTimeChart() {
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
                    Tổng thu theo thời gian
                </Typography>

                <Box sx={{ width: '100%', height: 350, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />

                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />

                            <Tooltip
                                formatter={(value) => [`${value.toLocaleString()} ₫`, 'Tổng thu']}
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
