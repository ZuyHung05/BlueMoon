import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function AvgTimeCard({ isLoading, avgTime = 3.2, trend = -0.4 }) {
  return (
    <Card
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #E3F2FD, #90CAF9)",
        color: "#0D47A1",
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={80} />
        ) : (
          <Box>
            {/* Title + Icon */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AccessTimeIcon sx={{ fontSize: 32, color: "#1565C0" }} />
              <Typography variant="h6" fontWeight="bold">
                Thời gian trung bình
              </Typography>
            </Box>

            {/* Main Value */}
            <Typography variant="h3" fontWeight="bold">
              {avgTime}h
            </Typography>

            {/* Description */}
            <Typography variant="body2" color="text.secondary">
              Thời gian xử lý trung bình mỗi sự cố
            </Typography>

            {/* Trend */}
            <Typography
              variant="caption"
              display="block"
              sx={{
                mt: 1,
                color: trend < 0 ? "#2E7D32" : "#C62828", // green = improvement, red = slower
              }}
            >
              {trend < 0
                ? `↓ ${Math.abs(trend)}h nhanh hơn tuần trước`
                : `↑ ${trend}h chậm hơn tuần trước`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
