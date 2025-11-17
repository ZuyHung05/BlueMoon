// src/pages/Engineer/components/TaskTable.jsx
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button
} from "@mui/material";
import UpdateProgressModal from "./UpdateProgressModal";

const mockTasks = [
  { id: "R101", type: "Rác thải", location: "Phường 3", status: "Đang xử lý", deadline: "12/11" },
  { id: "R102", type: "Ổ gà", location: "Quận 10", status: "Được giao", deadline: "13/11" },
  { id: "R103", type: "Đèn hỏng", location: "Phường 5", status: "Hoàn tất", deadline: "10/11" }
];

export default function TaskTable() {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getColor = (status) => {
    switch (status) {
      case "Đang xử lý": return "primary";
      case "Hoàn tất": return "success";
      default: return "warning";
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã báo cáo</strong></TableCell>
              <TableCell><strong>Loại sự cố</strong></TableCell>
              <TableCell><strong>Vị trí</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Hạn xử lý</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.location}</TableCell>
                <TableCell>
                  <Chip label={task.status} color={getColor(task.status)} />
                </TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpen(task)}
                  >
                    Cập nhật
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedTask && (
        <UpdateProgressModal
          open={open}
          onClose={handleClose}
          task={selectedTask}
        />
      )}
    </>
  );
}
