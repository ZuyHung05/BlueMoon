import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

// Import your existing chart components
import FeeByCategoryChart from "./charts/FeeByCategoryChart";
import RevenueOverTimeChart from "./charts/RevenueOverTimeChart";
import PaymentStatusBarChart from "./charts/PaymentStatusBarChart";
import CollectionPerformanceChart from "./charts/CollectionPerformanceChart";

export default function AdminReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Báo cáo & Thống kê
      </Typography>

      {/* SECTION: SUMMARY */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tổng quan hệ thống
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Trang báo cáo cung cấp cái nhìn tổng quan về tình hình thu phí, cư dân,
            phương tiện, và hiệu suất các đợt thu trong chung cư. Bạn có thể theo dõi
            xu hướng, kiểm tra trạng thái thanh toán và quản lý hoạt động hiệu quả.
          </Typography>
        </CardContent>
      </Card>

      {/* ROW 1 — FINANCE CHARTS */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          {/* Pie chart: Fee breakdown */}
          <FeeByCategoryChart />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Bar chart: Payment status */}
          <PaymentStatusBarChart />
        </Grid>
      </Grid>

      {/* ROW 2 — LINE CHART + COLLECTION PERFORMANCE */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={8}>
          {/* Line chart: Revenue over time */}
          <RevenueOverTimeChart />
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Horizontal performance chart for cycles */}
          <CollectionPerformanceChart />
        </Grid>
      </Grid>

      {/* SECTION: NOTES */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ghi chú & Phân tích nhanh
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            • Các tháng gần đây có xu hướng tăng trưởng mạnh về mức thu phí →
            Nên xem xét tăng cường gửi nhắc nhở thanh toán.
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            • Khoản phí dịch vụ chiếm tỷ trọng lớn nhất trong tổng thu →
            Đề xuất tối ưu chi phí bảo trì & vệ sinh.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            • Tỷ lệ nợ phí thấp, nhưng cần chú ý các hộ trễ hạn liên tục để tránh phát sinh vấn đề.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
