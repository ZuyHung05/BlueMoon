import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export default function ReportProblem() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const categories = [
    { label: "Pothole", icon: "🕳" },
    { label: "Garbage", icon: "🚯" },
    { label: "Broken Light", icon: "💡" },
    { label: "Flooding", icon: "🌧" },
    { label: "Accident", icon: "🚧" }
  ];

  const handleImageUpload = (e) => {
    let files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Report a Problem
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "gray", mb: 3 }}>
        Help us improve the city by reporting an issue.
      </Typography>

      <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 6px 25px rgba(0,0,0,0.05)" }}>
        
        {/* Upload Images */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Upload Images</Typography>
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            mb: 3
          }}
        >
          <CloudUploadIcon fontSize="large" sx={{ color: "#777" }} />
          <Typography>Select or drag images here</Typography>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Select Images
            <input type="file" hidden multiple onChange={handleImageUpload} />
          </Button>
        </Box>

        {/* Image Preview */}
        {images.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {images.map((img, idx) => (
              <Grid item key={idx}>
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 10,
                    objectFit: "cover"
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Category */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Category</Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {categories.map((c) => (
            <Chip
              key={c.label}
              label={`${c.icon} ${c.label}`}
              clickable
              onClick={() => setCategory(c.label)}
              color={category === c.label ? "primary" : "default"}
            />
          ))}
        </Box>

        {/* Description */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Description</Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Describe the problem..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <IconButton color="primary">
            <AutoFixHighIcon />
          </IconButton>
        </Box>

        {/* Location */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Location</Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Enter address or coordinates"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            startIcon={<LocationOnIcon />}
            onClick={detectLocation}
          >
            Detect
          </Button>
        </Box>

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          Submit Report
        </Button>
      </Card>
    </Box>
  );
}
