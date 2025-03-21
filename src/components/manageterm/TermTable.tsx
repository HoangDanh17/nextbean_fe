import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditModal from "./EditModal2";
import "@/components/css/manageintern/DataTable.css";
import {
  Button,
  CircularProgress,
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import AddModal from "./AddModal2";
import termApiRequest from "@/apiRequests/term";
import { TermListResType } from "@/schemaValidations/term.schema";
import dayjs from "dayjs";
import { toast } from "../ui/use-toast";
import { DownloadOutlined } from "@mui/icons-material";

export interface RowData2 {
  id: string;
  semester: string;
  university: string;
  "start-at": string;
  "end-at": string;
  status: string;
}

export interface RowData {
  semester: string;
  university: string;
  status: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TermTable = ({
  isFilter,
  dataFilter,
  handleReset,
}: {
  isFilter: boolean;
  dataFilter: RowData | null;
  handleReset: () => void;
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<RowData2 | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState<TermListResType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setSelectedRowData(null);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleOpenEditModal = (row: RowData2) => {
    setSelectedRowData(row);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedRowData(null);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleOpenDeleteModal = (row: RowData2) => {
    setSelectedRowData(row);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedRowData(null);
  };

  const handleDelete = () => {
    if (selectedRowData && selectedRowData.id) {
      termApiRequest.deleteTerm(selectedRowData.id);
    }
    setRefreshKey((prevKey) => prevKey + 1);
    toast({
      title: "Đã xóa thành công",
      duration: 2000,
      variant: "success",
    });
    handleCloseDeleteModal();
  };

  // handle close for all
  const closeButNotRefresh = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
  };

  const handleExport = async (id: string | number, name: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/reports/${id}/project-intern`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get filename from header Content-Disposition if present
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `${name}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch?.length === 2) {
          filename = filenameMatch[1];
        }
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create a URL object from blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor tag for download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;

      // Append anchor tag to body, trigger click, then remove it
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await termApiRequest.getListTerm(
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

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "not_started":
        return { backgroundColor: "#FFB6C1", color: "white" }; // Màu hồng pastel đậm hơn
      case "in_progress":
        return { backgroundColor: "#87CEEB", color: "white" }; // Màu xanh dương pastel đậm hơn
      case "completed":
        return { backgroundColor: "#90EE90", color: "white" }; // Màu xanh lá pastel đậm hơn
      default:
        return { backgroundColor: "#D3D3D3", color: "white" }; // Màu xám
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started":
        return "Chưa bắt đầu";
      case "in_progress":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  return (
    <div style={{ maxHeight: 762, width: "100%", marginTop: "10px" }}>
      <TableContainer component={Paper}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Table sx={{ minWidth: 640 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Kỳ</StyledTableCell>
                <StyledTableCell>Đại học</StyledTableCell>
                <StyledTableCell>Ngày bắt đầu</StyledTableCell>
                <StyledTableCell>Ngày kết thúc</StyledTableCell>
                <StyledTableCell align="center">Trạng thái</StyledTableCell>
                <StyledTableCell align="center">Hành động</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.data.map((account, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{account.semester}</StyledTableCell>
                  <StyledTableCell>{account.university}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(account["start-at"]).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {dayjs(account["end-at"]).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      size="small"
                      label={getStatusLabel(account.status)}
                      sx={getStatusChipColor(account.status)}
                    ></Chip>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      style={{ marginRight: "10px" }}
                      variant="contained"
                      color="warning"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEditModal(account)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleOpenDeleteModal(account)}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      className="bg-emerald-600 text-white hover:bg-emerald-800 ml-2"
                      startIcon={<DownloadOutlined />}
                      onClick={() => handleExport(account.id, account.semester)}
                    >
                      Xuất excel
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data?.paging.items || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="custom-row custom-pagination bg-white mb-4"
      />

      <Card>
        <CardContent style={{ height: "68px" }}>
          <Button
            variant="contained"
            className="add-btn"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
          >
            Tạo kỳ mới
          </Button>
        </CardContent>
      </Card>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddModal}
        onClose={closeButNotRefresh}
      >
        <AddModal onClose={handleCloseAddModal} />
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditModal}
        onClose={closeButNotRefresh}
      >
        <EditModal row={selectedRowData} onClose={handleCloseEditModal} />
      </Modal>

      <Modal open={openDeleteModal} onClose={closeButNotRefresh}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Xác nhận xóa
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Bạn có chắc chắn muốn xóa Kỳ: {selectedRowData?.semester}?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ mr: 1 }}
            >
              Xóa
            </Button>
            <Button variant="outlined" onClick={handleCloseDeleteModal}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default TermTable;
