import React from "react";
import { Box, Grid, Card, Typography, Button, CardContent } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function UserHomePage() {
  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
          color: "white",
          p: 4,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome back, LocNg!
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Keeping your city clean starts with you. What would you like to do today?
        </Typography>

        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="inherit"
            sx={{ color: "#2E7D32", fontWeight: 600 }}
            startIcon={<ReportProblemIcon />}
            href="/report-problem"
          >
            Report a Problem
          </Button>

          <Button
            variant="outlined"
            sx={{ borderColor: "white", color: "white" }}
            startIcon={<ListAltIcon />}
            href="/my-reports"
          >
            Track My Reports
          </Button>

          <Button
            variant="outlined"
            sx={{ borderColor: "white", color: "white" }}
            startIcon={<AccessTimeIcon />}
            href="/history"
          >
            View History
          </Button>
        </Box>
      </Box>

      {/* ACTION CARDS (FPT AI Factory style) */}
      <Grid container spacing={3}>
        {/* Card 1 */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
            }}
            onClick={() => (window.location.href = "/report-problem")}
          >
            <ReportProblemIcon sx={{ fontSize: 40, color: "#E65100" }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
              Report an Issue
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
              Submit a new report with images, description and location.
            </Typography>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
            }}
            onClick={() => (window.location.href = "/my-reports")}
          >
            <ListAltIcon sx={{ fontSize: 40, color: "#1565C0" }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
              Track My Reports
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
              Monitor the status of your submitted problems.
            </Typography>
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
            }}
            onClick={() => (window.location.href = "/history")}
          >
            <AccessTimeIcon sx={{ fontSize: 40, color: "#6A1B9A" }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
              View History
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
              Browse your past resolved reports.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* RECENT REPORTS */}
      <Card sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent Reports
        </Typography>

        <Grid container sx={{ p: 1, fontWeight: 600, color: "gray" }}>
          <Grid item xs={2}>ID</Grid>
          <Grid item xs={3}>Category</Grid>
          <Grid item xs={3}>Location</Grid>
          <Grid item xs={2}>Status</Grid>
          <Grid item xs={2}>Action</Grid>
        </Grid>

        {/* Example rows */}
        {[1, 2, 3].map((id) => (
          <Grid
            key={id}
            container
            sx={{ p: 1.5, borderBottom: "1px solid #eee", alignItems: "center" }}
          >
            <Grid item xs={2}>R10{id}</Grid>
            <Grid item xs={3}>Ổ Gà</Grid>
            <Grid item xs={3}>361 Ngô Quyền</Grid>
            <Grid item xs={2}>Pending</Grid>
            <Grid item xs={2}>
              <Button size="small" endIcon={<ArrowForwardIcon />} href="/my-reports">
                View
              </Button>
            </Grid>
          </Grid>
        ))}
      </Card>
    </Box>
  );
}
