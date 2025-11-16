import React from "react";
import { Card, CardContent, Typography, Skeleton } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function AssignedTasksCard({ isLoading }) {
  return (
    <Card sx={{ background: "linear-gradient(135deg, #E3F2FD, #90CAF9)", boxShadow: 2 }}>
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={70} />
        ) : (
          <>
            <Typography variant="h6" color="#1565C0">
              Nhiệm vụ được giao
            </Typography>
            <Typography variant="h3">8</Typography>
            <Typography variant="body2" color="textSecondary">
              Tổng số nhiệm vụ hiện tại
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
