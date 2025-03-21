"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableBody,
  styled,
  tableCellClasses,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  Chip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import FilterTimeTable from "@/components/timeTable/FilterTimeTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TimeTableResType,
  WeekResType,
} from "@/schemaValidations/timetable.schema";
import timetableApiRequest from "@/apiRequests/timetable";
import DetailTimeTable from "@/components/timeTable/DetailTimeTable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const styleCard = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const TimeTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>();
  const [selectedDayName, setSelectedDayName] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
  const [data, setData] = useState<TimeTableResType | undefined>();
  const [dataWeek, setDataWeek] = useState<WeekResType>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { payload } = await timetableApiRequest.getCurrentWeek();
        setDataWeek(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleFilterDateChange = (newValue: Dayjs | null) => {
    setFilterDate(newValue);
    const body = {
      "office-time-from": dayjs(newValue).format("YYYY-MM-DD"),
      "office-time-to": dayjs(newValue).format("YYYY-MM-DD"),
    };
    timetableApiRequest.getTimeTable(body).then((payload) => {
      setData(payload.payload);
    });
  };

  const handleCardClick = (date: string | Date | null, day: string) => {
    if (date) {
      setSelectedDay(dayjs(date));
      setSelectedDayName(day);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
    setFilterDate(null);
    setData(undefined);
  };

  const [openCardModal, setOpenCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const handleDoubleClick = (row: object) => {
    setSelectedCard(row);
    setOpenCardModal(true);
  };

  const handleCloseCardModal = () => {
    setOpenCardModal(false);
    setRefreshKey((prevKey) => prevKey + 1);
    setFilterDate(null);
    setData(undefined);
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "not-yet":
        return { backgroundColor: "#bab8b5", color: "white" }; // Màu hồng pastel đậm hơn
      case "present":
        return { backgroundColor: "green", color: "white" }; // Màu xanh lá pastel đậm hơn
      case "absent":
        return { backgroundColor: "red", color: "white" }; // Màu cam pastel đậm hơn
      default:
        return { backgroundColor: "#D3D3D3", color: "white" }; // Màu xám
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not-yet":
        return "Đang chờ";
      case "present":
        return "Đã điểm danh";
      case "absent":
        return "Vắng mặt";
      default:
        return "Không xác định";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mb: 2 }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="h4" component="div" sx={{ mr: 2 }}>
            Lịch làm việc của tuần này
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="space-between">
          {dataWeek?.data.map((day, index) => (
            <Grid item xs={12 / 7} key={index}>
              <Card
                onClick={() => handleCardClick(day.date, day["week-day"])}
                sx={{
                  cursor: "pointer",
                  width: 150,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    style={{ textAlign: "center" }}
                  >
                    {day["week-day"]}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ textAlign: "center" }}
                  >
                    {dayjs(day.date).format("DD/MM/YYYY")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "green",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Đã duyệt: {day["total-approved"]}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "orange",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Đang chờ: {day["total-waiting"]}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "red",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Từ chối: {day["total-denied"]}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/*  */}
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h4" component="div" sx={{ mr: 2, mt: 2 }}>
              Lịch sử làm việc
            </Typography>
            <Typography variant="h4" component="div" sx={{ mr: 2, mt: 2 }}>
              -
            </Typography>
            <DatePicker
              value={filterDate}
              format="DD/MM/YYYY"
              onChange={(newValue) => handleFilterDateChange(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  style: { marginTop: 10, backgroundColor: "white" },
                },
              }}
            />
          </Box>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <ScrollArea className="h-[240px]">
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tên thực tập</StyledTableCell>
                    <StyledTableCell>Mã thực tập sinh</StyledTableCell>
                    <StyledTableCell>Trạng thái duyệt</StyledTableCell>
                    <StyledTableCell>Trạng thái điểm danh</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.data.length > 0 ? (
                    data.data.map((intern, index) => (
                      <Tooltip
                        key={index}
                        title="Ấn 2 lần để xem chi tiết"
                        arrow
                      >
                        <StyledTableRow
                          key={intern.id}
                          onDoubleClick={() => handleDoubleClick(intern)}
                        >
                          <StyledTableCell>
                            {intern.intern_name}
                          </StyledTableCell>
                          <StyledTableCell>
                            {intern["student-code"]}
                          </StyledTableCell>
                          <StyledTableCell>
                            {intern.verified === "processing" ? (
                              <Typography
                                component="span"
                                style={{ color: "#bab8b5" }}
                              >
                                Đang đợi
                              </Typography>
                            ) : intern.verified === "approved" ? (
                              <Typography
                                component="span"
                                style={{ color: "green" }}
                              >
                                Đã duyệt
                              </Typography>
                            ) : (
                              <Typography
                                component="span"
                                style={{ color: "red" }}
                              >
                                Từ chối
                              </Typography>
                            )}
                          </StyledTableCell>
                          <StyledTableCell>
                            {intern["status-attendance"] === "not-yet" ? (
                              <Typography
                                component="span"
                                style={{ color: "#bab8b5" }}
                              >
                                Đang đợi
                              </Typography>
                            ) : intern["status-attendance"] === "present" ? (
                              <Typography
                                component="span"
                                style={{ color: "green" }}
                              >
                                Đã điểm danh
                              </Typography>
                            ) : (
                              <Typography
                                component="span"
                                style={{ color: "red" }}
                              >
                                Vắng mặt
                              </Typography>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      </Tooltip>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={10} align="center">
                        Chọn ngày để xem lịch sử
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TableContainer>
        </Box>
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          maxWidth="xl"
        >
          <DialogTitle id="dialog-title">Chi tiết lịch làm việc</DialogTitle>
          <DialogContent>
            <FilterTimeTable
              selectedDay={selectedDay}
              selectedDayName={selectedDayName}
            ></FilterTimeTable>
          </DialogContent>
        </Dialog>
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
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Chi tiết lịch làm việc &#160; - &#160;&#160;
                <Chip
                  size="small"
                  label={getStatusLabel(selectedCard?.["status-attendance"])}
                  sx={getStatusChipColor(selectedCard?.["status-attendance"])}
                ></Chip>
              </Typography>
              <DetailTimeTable
                row={selectedCard}
                handleCloseCard={handleCloseCardModal}
              ></DetailTimeTable>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
};

export default TimeTable;
