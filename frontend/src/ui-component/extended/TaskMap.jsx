import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";

export default function TaskMap() {
  return (
    <Card sx={{ height: 300, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <MapIcon color="primary" /> Bản đồ nhiệm vụ
        </Typography>
        <Typography color="text.secondary" mt={1}>
          (Hiển thị vị trí các sự cố được giao — tích hợp bản đồ sau)
        </Typography>
      </CardContent>
    </Card>
  );
}
