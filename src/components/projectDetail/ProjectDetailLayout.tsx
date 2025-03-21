"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tooltip,
} from "@mui/material";
import { useAppContext } from "@/app/app-provider";
import { DetailProjectResType } from "@/schemaValidations/project.schema";
import projectApiRequest from "@/apiRequests/project";
import dayjs from "dayjs";

const ProjectDetailLayout = () => {
  const { project } = useAppContext();
  const [data, setData] = useState<DetailProjectResType>();

  useEffect(() => {
    const id = project?.id;
    projectApiRequest.getDetailProject(id).then((res) => {
      setData(res.payload);
    });
  }, [project]);

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

  const projectDetails = [
    [
      { label: "Tên dự án", value: data?.data["name"] },
      { label: "Trạng thái", value: data?.data["status"], isChip: true },
    ],
    [
      {
        label: "Ngày dự kiến bắt đầu",
        value: dayjs(data?.data["est-start-time"]).format("DD/MM/YYYY"),
      },
      {
        label: "Ngày dự kiến kết thúc",
        value: dayjs(data?.data["est-completion-time"]).format("DD/MM/YYYY"),
      },
    ],
    [{ label: "Mô tả", value: data?.data.description }],
  ];

  const TruncatedText = ({
    text,
    maxLength = 50,
  }: {
    text: string;
    maxLength: number;
  }) => {
    const shouldTruncate = text.length > maxLength;
    const displayText = shouldTruncate
      ? `${text.slice(0, maxLength)} ...`
      : text;

    return shouldTruncate ? (
      <Tooltip title={text} arrow>
        <Typography noWrap>{displayText}</Typography>
      </Tooltip>
    ) : (
      <Typography>{displayText}</Typography>
    );
  };

  const DescriptionText = ({ text }: { text: string }) => (
    <Typography
      variant="body1"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        maxWidth: 650,
        overflowWrap: "break-word",
      }}
    >
      {text}
    </Typography>
  );

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-xl scale-100 border-2 border-cyan-600 hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardContent style={{ height: 150 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                style={{ marginTop: 30 }}
              >
                <Typography
                  variant="body1"
                  component="div"
                  className="underline underline-offset-4 decoration-violet-500"
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    textDecorationThickness: "2px",
                  }}
                >
                  SỐ LƯỢNG THÀNH VIÊN
                </Typography>
                <Typography variant="h5" style={{ marginTop: 10 }}>
                  {data?.data["total-member"]}
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-xl scale-100 border-2 border-emerald-600 hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardContent style={{ height: 150 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                style={{ marginTop: 30 }}
              >
                <Typography
                  variant="body1"
                  component="div"
                  className="underline underline-offset-4 decoration-emerald-500"
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    textDecorationThickness: "2px",
                  }}
                >
                  SỐ LƯỢNG CÔNG VIỆC HOÀN THÀNH
                </Typography>
                <Typography variant="h5" style={{ marginTop: 10 }}>
                  {data?.data["total-task-conpleted"]}
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-xl scale-100 border-2 border-rose-600 hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardContent style={{ height: 150 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                style={{ marginTop: 30 }}
              >
                <Typography
                  variant="body1"
                  component="div"
                  className="underline underline-offset-4 decoration-rose-500"
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    textDecorationThickness: "2px",
                  }}
                >
                  TỔNG SỐ CÔNG VIỆC
                </Typography>
                <Typography variant="h5" style={{ marginTop: 10 }}>
                  {data?.data["total-task"]}
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* New larger card */}
        <Grid item xs={12} md={8} lg={12}>
          <Card className="shadow-xl scale-100 border-2">
            <CardContent style={{ minHeight: 300, padding: "20px" }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Typography
                    variant="h5"
                    component="div"
                    className="underline underline-offset-4 decoration-blue-500"
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      textDecorationThickness: "2px",
                      marginBottom: "20px",
                    }}
                  >
                    THÔNG TIN DỰ ÁN
                  </Typography>
                </Grid>
                {projectDetails.map((row, rowIndex) => (
                  <Grid item key={rowIndex} style={{ width: "100%" }}>
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      {row.map((item, colIndex) => (
                        <React.Fragment key={colIndex}>
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            style={{ textAlign: "right", paddingRight: "10px" }}
                          >
                            <Typography
                              variant="h6"
                              style={{
                                fontWeight: 600,
                                fontFamily: "sans-serif",
                              }}
                            >
                              {item.label}:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={row.length === 1 ? 9 : 3}
                            style={{ textAlign: "left" }}
                          >
                            {item.isChip ? (
                              <Chip
                                size="small"
                                label={getStatusLabel(item.value as string)}
                                sx={getStatusChipColor(item.value as string)}
                              />
                            ) : item.label === "Tên dự án" ? (
                              <TruncatedText
                                text={item.value || ""}
                                maxLength={50}
                              />
                            ) : item.label === "Mô tả" ? (
                              <DescriptionText text={item.value || ""} />
                            ) : (
                              <Typography
                                variant="body1"
                                style={
                                  item.label === "Mô tả"
                                    ? { whiteSpace: "pre-wrap" }
                                    : {}
                                }
                              >
                                {item.value}
                              </Typography>
                            )}
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectDetailLayout;
