import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";

export default function InProgressTasksCard({ isLoading }) {
  return (
    <Card
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #FFF3E0, #FFB74D)",
        color: "#4E342E",
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={80} />
        ) : (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <BuildCircleIcon sx={{ fontSize: 32, color: "#E65100" }} />
              <Typography variant="h6" fontWeight="bold">
                Đang xử lý
              </Typography>
            </Box>

            <Typography variant="h3" fontWeight="bold">
              5
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Sự cố đang được đội kỹ thuật tiến hành
            </Typography>

            <Typography
              variant="caption"
              display="block"
              color="#6D4C41"
              sx={{ mt: 1 }}
            >
              +2 hôm nay
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
