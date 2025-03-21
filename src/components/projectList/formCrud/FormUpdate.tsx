"use client";
import {
  TextField,
  Typography,
  Grid,
  Box,
  styled,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs, { Dayjs } from "dayjs";
import { RowData } from "@/components/projectList/DetailCard";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { UpdateProjectType } from "@/schemaValidations/project.schema";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import projectApiRequest from "@/apiRequests/project";
import { toast } from "@/components/ui/use-toast";

const Div = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

const FormUpdate = ({
  row,
  handleClose,
}: {
  row: RowData;
  handleClose: () => void;
}) => {
  const [formData, setFormData] = useState<UpdateProjectType>({
    description: row.description,
    name: row.name,
    "est-completion-time": dayjs(row["est-completion-time"]).format(
      "YYYY-MM-DD"
    ),
    "est-start-time": dayjs(row["est-start-time"]).format("YYYY-MM-DD"),
    id: row.id,
    status: row.status,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData({
      ...formData,
      "est-start-time": date ? date.toDate() : null,
    });
  };

  const handleDateChange2 = (date: Dayjs | null) => {
    setFormData({
      ...formData,
      "est-completion-time": date ? date.toDate() : null,
    });
  };

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    if (loading) return;
    setLoading(true);
    e.preventDefault();

    // Validate that the end date is after the start date
    if (
      formData["est-completion-time"] &&
      formData["est-start-time"] &&
      dayjs(formData["est-completion-time"]).isBefore(
        dayjs(formData["est-start-time"])
      )
    ) {
      setErrorMessage(
        "Ngày dự kiến kết thúc phải lớn hơn ngày dự kiến bắt đầu"
      );
      setLoading(false);
      return;
    }

    const {
      "est-start-time": startTime,
      "est-completion-time": completeTime,
      ...rest
    } = formData;
    const formattedData = {
      ...rest,
      "est-start-time": startTime
        ? dayjs(startTime).format("YYYY-MM-DD")
        : null,
      "est-completion-time": completeTime
        ? dayjs(completeTime).format("YYYY-MM-DD")
        : null,
      id: row.id,
    };

    try {
      const result = await projectApiRequest
        .updateProject(formattedData)
        .then((response) => {
          toast({
            title: `${response.payload.message}`,
            duration: 2000,
            variant: "success",
          });
          handleClose();
        });
    } catch (error: any) {
      const errorRes = { error };
      setErrorMessage(errorRes.error.payload.log);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Div>
        <div style={{ textAlignLast: "center" }}>
          <Typography id="transition-modal-title" variant="h4" component="h2">
            Sửa dự án
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Tên dự án</Typography>
                <TextField
                  id="name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  size="small"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Ngày dự kiến bắt đầu</Typography>
                <DatePicker
                  value={dayjs(formData["est-start-time"])}
                  onChange={(newValue) => handleDateChange(newValue)}
                  sx={{ marginTop: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Ngày dự kiến kết thúc</Typography>
                <DatePicker
                  value={dayjs(formData["est-completion-time"])}
                  onChange={(newValue) => handleDateChange2(newValue)}
                  sx={{ marginTop: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </Grid>
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography color="error">{errorMessage}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="h6">Thông tin mô tả</Typography>
                <TextField
                  id="description"
                  name="description"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  size="small"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Trạng thái</Typography>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  variant="standard"
                  size="small"
                  sx={{ marginTop: 1 }}
                  style={{ width: "100%" }}
                >
                  <MenuItem value={"not_started"}>Chưa bắt đầu</MenuItem>
                  <MenuItem value={"in_progress"}>Đang diễn ra</MenuItem>
                  <MenuItem value={"completed"}>Đã kết thúc</MenuItem>
                  <MenuItem value={"cancel"}>Hủy bỏ</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  startIcon={<EditIcon />}
                  style={{ width: "100%" }}
                >
                  Sửa dự án
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Div>
    </LocalizationProvider>
  );
};

export default FormUpdate;
