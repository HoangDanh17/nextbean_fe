"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Typography,
  Grid,
  Box,
  styled,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";
import projectApiRequest from "@/apiRequests/project";
import { CreateProjectType } from "@/schemaValidations/project.schema";
import { toast } from "@/components/ui/use-toast";

const Div = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

const FormCreate = ({ handleClose }: { handleClose: () => void }) => {
  const [formData, setFormData] = useState<CreateProjectType>({
    description: "",
    name: "",
    "est-start-time": new Date(),
    "est-completion-time": new Date(),
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const formattedData = {
      ...formData,
      "est-start-time": formData["est-start-time"]
        ? dayjs(formData["est-start-time"]).format("YYYY-MM-DD")
        : null,
      "est-completion-time": formData["est-completion-time"]
        ? dayjs(formData["est-completion-time"]).format("YYYY-MM-DD")
        : null,
    };

    try {
      const result = await projectApiRequest
        .createProject(formattedData)
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
        <div style={{ textAlign: "center" }}>
          <Typography id="transition-modal-title" variant="h4" component="h2">
            Tạo dự án
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Tên dự án</Typography>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="Nhập tên dự án"
                  style={{ marginTop: 2 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Mô tả</Typography>
                <TextField
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Nhập chi tiết thông tin"
                  style={{ marginTop: 2 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginBottom: 4 }}>
                  Ngày dự kiến bắt đầu
                </Typography>
                <DatePicker
                  value={dayjs(formData["est-start-time"])}
                  onChange={(newValue) => handleDateChange(newValue)}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginBottom: 4 }}>
                  Ngày dự kiến kết thúc
                </Typography>
                <DatePicker
                  value={dayjs(formData["est-completion-time"])}
                  onChange={(newValue) => handleDateChange2(newValue)}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography color="error">{errorMessage}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="primary"
                  style={{ width: "100%" }}
                >
                  Tạo dự án
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Div>
    </LocalizationProvider>
  );
};

export default FormCreate;
