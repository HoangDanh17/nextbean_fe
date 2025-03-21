"use client";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  WorkOutline,
  PersonOutline,
  DownloadOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import dashboardApiRequest from "@/apiRequests/dashboard";
import {
  dashboardListResType,
  dashboardListTotalResType,
} from "@/schemaValidations/dashboard.schema";

const Dashboard = () => {
  const [listTerm, setListTerm] = useState<dashboardListResType>();
  const [total, setTotal] = useState<dashboardListTotalResType>();
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
    dashboardApiRequest.getOjt().then((res) => {
      setListTerm(res.payload);
    });
    dashboardApiRequest.getTotal().then((res) => {
      setTotal(res.payload);
    });
  }, []);

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substr(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      return truncated.substr(0, lastSpaceIndex) + "...";
    }
    return truncated + "...";
  };

  return (
    <div>
      <Box sx={{ width: "100%", mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <WorkOutline
                    sx={{
                      fontSize: 40,
                      bgcolor: "#DFCCFB",
                      color: "white",
                      borderRadius: 2,
                      p: 1,
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="div"
                    className="underline decoration-pink-500 font-[700]"
                  >
                    TỔNG SỐ DỰ ÁN
                  </Typography>
                  <Typography variant="h2" component="div">
                    {total?.data["total-project-in-progress"]}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <PersonOutline
                    sx={{
                      fontSize: 40,
                      bgcolor: "#EF9595",
                      color: "white",
                      borderRadius: 2,
                      p: 1,
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="div"
                    className="underline decoration-indigo-500 font-[700]"
                  >
                    TỔNG THỰC TẬP HIỆN TẠI
                  </Typography>
                  <Typography variant="h2" component="div">
                    {total?.data["total-intern-in-progress"]}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {listTerm?.data.map((term) => (
            <Grid item xs={12} sm={6} md={4} lg={6} key={term.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Kì:</strong> {term.semester}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Đại học:</strong>{" "}
                        <Tooltip title={term.university} arrow>
                          <span style={{ cursor: "pointer" }}>
                            {truncateText(term.university, 30)}
                          </span>
                        </Tooltip>
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Trạng thái:</strong>{" "}
                        <Chip
                          size="small"
                          label={getStatusLabel(term.status)}
                          sx={getStatusChipColor(term.status)}
                        ></Chip>
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <strong>Tổng thực tập:</strong> {term["total-intern"]}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      container
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        size="small"
                        className="bg-emerald-600 text-white hover:bg-emerald-800"
                        startIcon={<DownloadOutlined />}
                        onClick={() => handleExport(term.id, term.semester)}
                      >
                        Xuất excel
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
