import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Typography
} from "@mui/material";

export default function UpdateProgressModal({ open, onClose, task }) {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    console.log("Update task:", task.id, note, image);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Cập nhật tiến trình - {task.type}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={1}>
          Vị trí: {task.location}
        </Typography>
        <TextField
          label="Ghi chú"
          multiline
          fullWidth
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          style={{ marginTop: "10px" }}
          onChange={(e) => setImage(e.target.files[0])}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}
