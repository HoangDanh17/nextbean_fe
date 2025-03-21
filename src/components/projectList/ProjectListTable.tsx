"use client";
import {
  Box,
  Fade,
  Modal,
  Chip,
  Fab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  styled,
  TableCell,
  tableCellClasses,
  TableBody,
  Tooltip,
  TablePagination,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import FormCreate from "@/components/projectList/formCrud/FormCreate";
import AddIcon from "@mui/icons-material/Add";
import { Label } from "@/components/ui/label";
import DetailCard from "@/components/projectList/DetailCard";
import projectApiRequest from "@/apiRequests/project";
import { ProjectListResType } from "@/schemaValidations/project.schema";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const styleCard = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

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

export interface FormFilterData {
  name: string;
  status: string;
  "est-start-time-from": string;
  "est-start-time-to": string;
}

export default function ProjectListTable({
  isFilter,
  dataFilter,
  handleReset,
}: {
  isFilter: boolean;
  dataFilter: FormFilterData | null;
  handleReset: () => void;
}) {
  const [data, setData] = useState<ProjectListResType | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await projectApiRequest.getListProject(
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
  }, [isFilter, dataFilter, page, rowsPerPage, refreshKey]);

  // Card click
  const [openCardModal, setOpenCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const handleDoubleClick = (row: object) => {
    setSelectedCard(row);
    setOpenCardModal(true);
  };

  const handleCloseCardModal = () => {
    setOpenCardModal(false);
    handleReset();
    triggerRefresh();
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "not_started":
        return { backgroundColor: "#FFB6C1", color: "white" }; // Màu hồng pastel đậm hơn
      case "in_progress":
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
      case "not_started":
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

  // Create modal
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    handleReset();
    triggerRefresh();
  };

  return (
    <div>
      <div
        style={{
          marginTop: 20,
          width: "100%",
          backgroundColor: "white",
          padding: 8,
        }}
      >
        {/* Card */}
        <div className="flex mb-4">
          <Label style={{ fontSize: 36, alignSelf: "center", marginRight: 12 }}>
            Quản lí dự án
          </Label>
          <Fab
            style={{ alignSelf: "center" }}
            size="small"
            color="default"
            aria-label="edit"
            variant="extended"
            onClick={handleOpenCreateModal}
          >
            <AddIcon sx={{ mr: 1 }} />
            Tạo dự án
          </Fab>
        </div>

        <TableContainer component={Paper} className="mt-4">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên dự án</StyledTableCell>
                <StyledTableCell align="center">
                  Ngày dự kiến bắt đầu
                </StyledTableCell>
                <StyledTableCell align="center">
                  Ngày dự kiến kết thúc
                </StyledTableCell>
                <StyledTableCell align="center">Trạng thái</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((row, index) => (
                <Tooltip key={index} title="Ấn 2 lần để xem chi tiết" arrow>
                  <StyledTableRow onDoubleClick={() => handleDoubleClick(row)}>
                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {dayjs(row["est-start-time"]).format("DD/MM/YYYY")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {dayjs(row["est-completion-time"]).format("DD/MM/YYYY")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={getStatusLabel(row.status)}
                        sx={getStatusChipColor(row.status)}
                      ></Chip>
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
        </TableContainer>
      </div>
      {/* Modal Create*/}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openCreateModal}>
          <Box sx={style}>
            <FormCreate handleClose={handleCloseCreateModal}></FormCreate>
          </Box>
        </Fade>
      </Modal>
      {/* Card Detail */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openCardModal}
        onClose={handleCloseCardModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openCardModal}>
          <Box sx={styleCard}>
            <DetailCard
              row={selectedCard}
              handleCloseCard={handleCloseCardModal}
            ></DetailCard>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
