import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "@/components/css/manageintern/ModalBox.css";
import { CreateTermType } from "@/schemaValidations/term.schema";
import termApiRequest from "@/apiRequests/term";
import { toast } from "../ui/use-toast";

interface AddModalProps {
  onClose: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateTermType>({
    semester: "",
    university: "",
    "start-at": "",
    "end-at": "",
  });

  const [errors, setErrors] = useState({
    semester: "",
    university: "",
    "start-at": "",
    "end-at": "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: value ? "" : "This field is required",
    });
  };

  const handleDateChange = (name: string, date: Dayjs | null) => {
    const newDate = date ? date.toISOString() : "";
    setFormData({
      ...formData,
      [name]: newDate,
    });

    if (name === "start-at" && formData["end-at"]) {
      const isValid =
        !formData["end-at"] ||
        dayjs(newDate).isBefore(dayjs(formData["end-at"]));
      setErrors({
        ...errors,
        "start-at": newDate ? "" : "This field is required",
        "end-at": isValid ? "" : "End date must be after start date",
      });
    } else if (name === "end-at") {
      const isValid =
        !formData["start-at"] ||
        dayjs(newDate).isAfter(dayjs(formData["start-at"]));
      setErrors({
        ...errors,
        "end-at": isValid ? "" : "End date must be after start date",
      });
    } else {
      setErrors({
        ...errors,
        [name]: newDate ? "" : "This field is required",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      semester: formData.semester ? "" : "This field is required",
      university: formData.university ? "" : "This field is required",
      "start-at": formData["start-at"] ? "" : "This field is required",
      "end-at": formData["end-at"] ? "" : "This field is required",
    };

    if (formData["start-at"] && formData["end-at"]) {
      newErrors["end-at"] = dayjs(formData["end-at"]).isAfter(
        dayjs(formData["start-at"])
      )
        ? ""
        : "End date must be after start date";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const formattedData = {
      ...formData,
      "start-at": formData["start-at"]
        ? dayjs(formData["start-at"]).format("YYYY-MM-DD")
        : "",
      "end-at": formData["end-at"]
        ? dayjs(formData["end-at"]).format("YYYY-MM-DD")
        : "",
    };
    console.log("Form Data:", formattedData);
    try {
      const result = await termApiRequest.createTerm(formattedData);
      toast({
        title: `${result.payload.message}`,
        duration: 2000,
        variant: "success",
      });
      console.log(result);
    } catch (error: any) {
      toast({
        title: `${error.message}`,
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="modal-box">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Thêm kì học mới
        </Typography>

        <FormControl>
          <Grid container spacing={2} marginY={2}>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.semester}>
                <TextField
                  label="Kì"
                  name="semester"
                  size="small"
                  value={formData.semester}
                  onChange={handleChange}
                  error={!!errors.semester}
                />
                {errors.semester && (
                  <FormHelperText>{errors.semester}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.university}>
                <TextField
                  label="Trường"
                  size="small"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  error={!!errors.university}
                />
                {errors.university && (
                  <FormHelperText>{errors.university}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors["start-at"]}>
                <DatePicker
                  label="Ngày bắt đầu"
                  format="DD/MM/YYYY"
                  value={
                    formData["start-at"] ? dayjs(formData["start-at"]) : null
                  }
                  onChange={(date) => handleDateChange("start-at", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors["start-at"],
                    },
                  }}
                />
                {errors["start-at"] && (
                  <FormHelperText>{errors["start-at"]}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors["end-at"]}>
                <DatePicker
                  label="Ngày kết thúc"
                  format="DD/MM/YYYY"
                  value={formData["end-at"] ? dayjs(formData["end-at"]) : null}
                  onChange={(date) => handleDateChange("end-at", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors["end-at"],
                    },
                  }}
                />
                {errors["end-at"] && (
                  <FormHelperText>{errors["end-at"]}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Loading..." : "Tạo"}
            </Button>
          </Box>
        </FormControl>
      </Box>
    </LocalizationProvider>
  );
};

export default AddModal;
