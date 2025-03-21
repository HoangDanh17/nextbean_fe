// TaskList.tsx
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TablePagination,
  Box,
  Chip,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "@/styles/accountManagement/DataTable.css";
import listTaskApiRequest from "@/apiRequests/listTask/listTask";
import {
  ListTaskAllResType,
  ListTaskType,
} from "@/schemaValidations/listTask/listTask.schema";
import ButtonTask from "./ButtonTask";
import EditTaskModal from "./UpdateTask";
import { useAppContext } from "@/app/app-provider";
import DetailTaskModal from "@/components/manager/mainLayout/DetailTaskModal";

export interface Task {
  id: string;
  "assigned-to": string;
  description: string;
  "estimated-effort": number;
  "is-approved": string;
  name: string;
}
export interface FormFilterData {
  name: string;
  status: string;
  "assignee-name": string;
  "assignee-code": string;
  "is-approved": string;
}

function TaskList({
  isFilter,
  dataFilter,
}: {
  isFilter: boolean;
  dataFilter: FormFilterData | null;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openReport, setOpenReport] = useState(false);

  const [data, setData] = useState<ListTaskAllResType | null>(null);
  const [loading, setLoading] = useState(false);

  // State for modal
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { project } = useAppContext();

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };
  const [selectedReport, setSelectedReport] = useState<ListTaskType>();
  
  const handleOpenReport = (task: ListTaskType) => {
    setOpenReport(true);
    setSelectedReport(task);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
    triggerRefresh();
  };

  const handleCloseReport = () => {
    setOpenReport(false);
    triggerRefresh();
  };

  // handle close for all
  const closeNotRefresh = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await listTaskApiRequest.getListTask(
          project?.id,
          page + 1,
          rowsPerPage,
          isFilter ? dataFilter : {}
        );
        setData(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isFilter, page, rowsPerPage, dataFilter, refreshKey]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6">Tên công việc</Typography>
        <Typography variant="h6">Người được giao</Typography>
        <Typography variant="h6" sx={{ marginRight: 4 }}>
          MSSV của người được giao
        </Typography>
        <Typography variant="h6" sx={{ marginRight: 3 }}>
          status
        </Typography>
      </Box>
      <List>
        {data?.data.map((task) => (
          <Accordion key={task.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>{task.name}</Typography>
                <Typography>{task["assigned-name"]}</Typography>
                <Typography>{task["assigned-code"]}</Typography>
                <Chip label={task.status} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <ListItem sx={{ width: "auto" }}>
                  <ListItemText
                    primary="Description"
                    secondary={task.description}
                    secondaryTypographyProps={{
                      style: { fontWeight: "bold", fontSize: 13 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ width: "auto" }}>
                  <ListItemText
                    primary="Assigned Name"
                    secondary={task["assigned-name"]}
                    secondaryTypographyProps={{
                      style: { fontWeight: "bold", fontSize: 13 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ width: "auto" }}>
                  <ListItemText
                    primary="Assigned code"
                    secondary={task["assigned-code"]}
                    secondaryTypographyProps={{
                      style: { fontWeight: "bold", fontSize: 13 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ width: "auto" }}>
                  <ListItemText
                    primary="Estimated effort"
                    secondary={task["estimated-effort"]}
                    secondaryTypographyProps={{
                      style: { fontWeight: "bold", fontSize: 13 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ width: "auto" }}>
                  <ListItemText
                    primary="Xác nhận"
                    secondary={task["is-approved"]}
                    secondaryTypographyProps={{
                      style: { fontWeight: "bold", fontSize: 13 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ width: "auto" }}>
                  <ListItemText
                    primary="Actual effort"
                    secondary={task["actual-effort"]}
                  />
                </ListItem>
              </Box>
              {/* <Button sx={{ marginRight: 1 }} variant="contained" color="primary">Assign</Button> */}
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleOpen(task)}
                className="mr-2"
              >
                Cập nhật
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleOpenReport(task)}
              >
                Xem báo cáo
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </List>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data?.paging.items || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="custom-row custom-pagination"
      />

      <ButtonTask triggerRefresh={triggerRefresh} />

      {/* Modal for updating task */}
      <Modal open={open} onClose={closeNotRefresh}>
        <Box>
          <EditTaskModal onClose={handleClose} task={selectedTask} />
        </Box>
      </Modal>
      <Dialog
        open={openReport}
        onClose={handleCloseReport}
        maxWidth="xl"
        fullWidth
        style={{ top: -20, bottom: -20 }}
      >
        <DialogTitle>Chi tiết công việc</DialogTitle>
        <DialogContent>
        {selectedReport && (
          <>
            <DetailTaskModal selectedRow={selectedReport} />
          </>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReport} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskList;
