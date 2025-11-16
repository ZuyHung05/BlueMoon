import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CompletedTasksCard({ isLoading, count = 12, trend = +3 }) {
  return (
    <Card
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #E8F5E9, #81C784)",
        color: "#1B5E20",
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={80} />
        ) : (
          <Box>
            {/* Icon + Title */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CheckCircleIcon sx={{ fontSize: 32, color: "#2E7D32" }} />
              <Typography variant="h6" fontWeight="bold">
                Đã hoàn tất
              </Typography>
            </Box>

            {/* Main value */}
            <Typography variant="h3" fontWeight="bold">
              {count}
            </Typography>

            {/* Description */}
            <Typography variant="body2" color="text.secondary">
              Sự cố đã được xử lý hoàn toàn
            </Typography>

            {/* Trend indicator */}
            <Typography
              variant="caption"
              display="block"
              sx={{
                mt: 1,
                color: trend >= 0 ? "#2E7D32" : "#C62828",
              }}
            >
              {trend >= 0
                ? `↑ ${trend} so với tuần trước`
                : `↓ ${Math.abs(trend)} so với tuần trước`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
