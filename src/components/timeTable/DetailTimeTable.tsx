import { TimeTableType } from "@/schemaValidations/timetable.schema";
import React, { useState } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import timetableApiRequest from "@/apiRequests/timetable";
import { toast } from "@/components/ui/use-toast";
import dayjs from "dayjs";

const DetailTimeTable = ({
  row,
  handleCloseCard,
}: {
  row: TimeTableType;
  handleCloseCard: () => void;
}) => {
  const renderStatus = (status: string, timeType: string) => {
    switch (status) {
      case "not-yet":
        return (
          <Typography
            variant="body2"
            style={{ color: "#AEC6CF", fontWeight: "bold" }} // Pastel xanh nhạt
          >
            - Đang chờ
          </Typography>
        );
      case "authen-by-ip":
        return (
          <Typography
            variant="body2"
            style={{ color: "#EEC759", fontWeight: "bold" }} // Pastel cam
          >
            - Điểm danh tại văn phòng
          </Typography>
        );
      case "admin-check":
        return (
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              style={{
                color: "#EEC759",
                fontWeight: "bold",
                marginRight: "8px",
              }}
            >
              - Chờ admin duyệt
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ThumbUpIcon />}
              onClick={() => handleSubmitValidate(row.id, timeType)}
              style={{ borderColor: "#77DD77", color: "#77DD77" }}
            >
              duyệt
            </Button>
          </Box>
        );
      case "admin-approve":
        return (
          <Typography
            variant="body2"
            style={{ color: "#A1EEBD", fontWeight: "bold" }}
          >
            - Admin đã duyệt
          </Typography>
        );
      default:
        return null;
    }
  };

  const renderTime = (time: string) => {
    return time ? time : "đang đợi";
  };

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  async function handleSubmit(id: string, newStatus: string) {
    setLoading(true);

    const body = { status: newStatus };
    try {
      const result = await timetableApiRequest.absentTimeTable(id, body);
      toast({
        title: `${result.payload.message}`,
        duration: 2000,
        variant: "success",
      });
      handleCloseCard();
    } catch (error: any) {
      const errorRes = { error };
      setErr(errorRes.error.payload.message);
      const errorMessage = errorRes.error.payload.message;
      const splitMessage = errorMessage.split(":");

      if (splitMessage.length > 1) {
        const trimmedMessage = splitMessage[1].trim();
        setErr(trimmedMessage);
      } else {
        setErr(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitValidate(id: string, newStatus: string) {
    setLoading(true);

    const body = { "validate-field": newStatus };
    try {
      const result = await timetableApiRequest.adminValidateTimeTable(id, body);
      toast({
        title: `${result.payload.message}`,
        duration: 2000,
        variant: "success",
      });
      handleCloseCard();
    } catch (error: any) {
      const errorRes = { error };
      setErr(errorRes.error.payload.message);
      const errorMessage = errorRes.error.payload.message;
      const splitMessage = errorMessage.split(":");

      if (splitMessage.length > 1) {
        const trimmedMessage = splitMessage[1].trim();
        setErr(trimmedMessage);
      } else {
        setErr(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Grid container direction="column" spacing={2} style={{ marginTop: 10 }}>
        <Grid item>
          <Grid container height="30px">
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                Ngày lên văn phòng:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {dayjs(row["office-time"]).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container height="30px">
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                Giờ đến (dự kiến):
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {renderTime(row["est-start-time"])}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container height="30px">
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                Giờ đến (thực tế):
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" style={{ marginRight: "8px" }}>
                  {renderTime(row["act-clockin"])}
                </Typography>
                {renderStatus(row["clockin-validated"], "clockin")}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container height="30px">
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                Giờ về (dự kiến):
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {renderTime(row["est-end-time"])}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container height="30px">
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                Giờ về (thực tế):
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" style={{ marginRight: "8px" }}>
                  {renderTime(row["act-clockout"])}
                </Typography>
                {renderStatus(row["clockout-validated"], "clockout")}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        {err && <Typography color="red">{err}</Typography>}
      </Box>
      {row["status-attendance"] !== "present" && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              handleSubmit(
                row.id,
                row["status-attendance"] === "absent" ? "remove" : "absent"
              )
            }
            disabled={loading}
          >
            {loading
              ? "..."
              : row["status-attendance"] === "absent"
              ? "Gỡ vắng"
              : "Vắng mặt"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DetailTimeTable;
