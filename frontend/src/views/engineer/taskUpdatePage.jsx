import { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Divider
} from "@mui/material";

export default function TaskUpdatePage() {
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = () => {
    console.log({
      status,
      notes,
      images,
    });

    alert("Task updated successfully!");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Update Task
      </Typography>

      {/* Task Details Card */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Task Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Report ID
            </Typography>
            <Typography variant="body1">R102</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1">Ổ gà</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1">361 Ngô Quyền</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Citizen
            </Typography>
            <Typography variant="body1">LocNg</Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Task Update Form */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Update Information
        </Typography>

        <Grid container spacing={3}>
          {/* Status */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Update Status
            </Typography>
            <TextField
              select
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Notes / Progress Description
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Describe the issue, progress, or completion details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Upload Images (optional)
            </Typography>

            <Button variant="outlined" component="label">
              Choose Images
              <input hidden accept="image/*" type="file" multiple onChange={handleImageUpload} />
            </Button>

            {/* Preview images */}
            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              {images.map((img, index) => (
                <Chip
                  key={index}
                  label={img.name}
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.2, fontWeight: 600 }}
              onClick={handleSubmit}
            >
              Submit Update
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
