"use client";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DetailTaskModal from "@/components/manager/mainLayout/DetailTaskModal";
import { useAppContext } from "@/app/app-provider";
import {
  TaskFilterType,
  TaskListResType,
  TaskType,
} from "@/schemaValidations/task.schema";
import { useEffect, useState } from "react";
import taskApiRequest from "@/apiRequests/task";
import { Button, Chip, DialogActions } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "8px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: "40px", // Giảm chiều cao của hàng
  cursor: "pointer", // Thêm con trỏ để hiển thị rằng hàng có thể được chọn
}));

export default function ListTable({
  isFilter,
  dataFilter,
  handleReset,
}: {
  isFilter: boolean;
  dataFilter: TaskFilterType | null;
  handleReset: () => void;
}) {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [open, setOpen] = useState(false);
  const { project } = useAppContext();
  const [selectedRow, setSelectedRow] = useState<null | TaskType>(null);

  const handleDoubleClick = (row: TaskType | null) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TaskListResType | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await taskApiRequest.getListTask(
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
  }, [isFilter, page, rowsPerPage, dataFilter]);

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "todo":
        return { backgroundColor: "#FFB6C1", color: "white" }; // Màu hồng pastel đậm hơn
      case "inprogress":
        return { backgroundColor: "#87CEEB", color: "white" }; // Màu xanh dương pastel đậm hơn
      case "completed":
        return { backgroundColor: "#90EE90", color: "white" }; // Màu xanh lá pastel đậm hơn
      case "cancel":
        return { backgroundColor: "#FFA07A", color: "white" }; // Màu cam pastel đậm hơn
      default:
        return { backgroundColor: "#D3D3D3", color: "white" }; // Màu xám
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "Chưa bắt đầu";
      case "in_progress":
        return "Đang thực hiện";
      case "completed":
        return "Hoàn thành";
      case "cancel":
        return "Hủy bỏ";
      default:
        return "Không xác định";
    }
  };

  return (
    <TableContainer component={Paper} className="mt-4">
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tên công việc</StyledTableCell>
            <StyledTableCell align="center">Thời gian (act)</StyledTableCell>
            <StyledTableCell align="center">Thời gian (est)</StyledTableCell>
            <StyledTableCell align="center">Trạng thái</StyledTableCell>
            <StyledTableCell align="center">
              Người được phân công
            </StyledTableCell>
            <StyledTableCell align="center">Mã thực tập</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((row, index) => (
            <Tooltip key={index} title="Ấn 2 lần để xem chi tiết" arrow>
              <StyledTableRow onDoubleClick={() => handleDoubleClick(row)}>
                <StyledTableCell align="left" style={{
                    maxWidth: "200px",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                  }}>{row.name}</StyledTableCell>
                <StyledTableCell align="center">
                  {row["actual-effort"]} giờ
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row["estimated-effort"]} giờ
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    size="small"
                    label={getStatusLabel(row.status)}
                    sx={getStatusChipColor(row.status)}
                  ></Chip>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row["assigned-name"]}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row["assigned-code"]}
                </StyledTableCell>
              </StyledTableRow>
            </Tooltip>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data?.paging.items || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth style={{top:-20,bottom:-20}}>
        <DialogTitle>Chi tiết công việc</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <DetailTaskModal selectedRow={selectedRow} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
