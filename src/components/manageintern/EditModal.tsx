"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import "@/components/css/manageintern/ModalBox.css";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "../ui/use-toast";
import EditIcon from "@mui/icons-material/Edit";

import {
  InternByIdResType,
  UpdateInternType,
} from "@/schemaValidations/intern.schema";
import internApiRequest from "@/apiRequests/intern";
import { TermListResType } from "@/schemaValidations/term.schema";
import termApiRequest from "@/apiRequests/term";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../app/firebase";
import Image from "next/image";

const EditModal = ({
  row,
  onClose,
}: {
  row: InternByIdResType | null;
  onClose: () => void;
}) => {
  console.log(row);
  const [formData, setFormData] = useState<UpdateInternType>({
    "user-name": row?.data["user-name"] || "",
    email: row?.data.email || "",
    "student-code": row?.data["student-code"] || "",
    avatar: row?.data.avatar || "",
    gender: row?.data.gender || "",
    "date-of-birth": row?.data["date-of-birth"] || "",
    "phone-number": row?.data["phone-number"] || "",
    address: row?.data.address || "",
    "ojt-id": row?.data["ojt-id"],
  });

  const [errors, setErrors] = useState({
    "user-name": "",
    email: "",
    "student-code": "",
    "phone-number": "",
    address: "",
    gender: "",
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageRef = ref(storage, `avatars/${file.name + Date.now()}`);

    try {
      setLoading(true);
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData((prev) => ({ ...prev, avatar: url }));
      toast({
        title: "Avatar uploaded successfully",
        duration: 2000,
        variant: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Failed to upload avatar",
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [submitError, setSubmitError] = useState<string>("");

  const handleDateChange = (name: string, date: Dayjs | null) => {
    setFormData({
      ...formData,
      [name]: date ? date.toISOString() : "",
    });
  };

  const handleChange =
    (name: keyof UpdateInternType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData({
        ...formData,
        [name]: value,
      });

      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
      }

      if (name === "phone-number") {
        if (value.length < 10 || value.length > 11) {
          setErrors((prev) => ({
            ...prev,
            "phone-number": "Số điện thoại phải đủ 10 đến 11 số",
          }));
        } else {
          setErrors((prev) => ({ ...prev, "phone-number": "" }));
        }
      }

      if (name === "user-name") {
        if (value.length < 4) {
          setErrors((prev) => ({
            ...prev,
            "user-name": "Tên người dùng phải lớn hơn 4 kí tự",
          }));
        } else {
          setErrors((prev) => ({ ...prev, "user-name": "" }));
        }
      }

      if (name === "student-code") {
        if (value.length < 4) {
          setErrors((prev) => ({
            ...prev,
            "student-code": "Mã sinh viên phải lớn hơn 4 kí tự",
          }));
        } else {
          setErrors((prev) => ({ ...prev, "student-code": "" }));
        }
      }
    };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "gender" && value) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    let valid = true;
    const newErrors = { ...errors };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (
      formData["phone-number"].length < 10 ||
      formData["phone-number"].length > 11
    ) {
      newErrors["phone-number"] = "Số điện thoại phải đủ 10 đến 11 số";
      valid = false;
    } else {
      newErrors["phone-number"] = "";
    }

    if (formData["user-name"].length < 4) {
      newErrors["user-name"] = "Tên người dùng phải lớn hơn 4 kí tự";
      valid = false;
    } else {
      newErrors["user-name"] = "";
    }

    if (formData["student-code"].length < 4) {
      newErrors["student-code"] = "Mã sinh viên phải lớn hơn 4 kí tự";
      valid = false;
    } else {
      newErrors["student-code"] = "";
    }

    if (!formData.gender) {
      newErrors.gender = "Giới tính không được để trống";
      valid = false;
    } else {
      newErrors.gender = "";
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);
    const formattedData = {
      ...formData,
    };

    console.log("Form Data:", formattedData);
    try {
      const result = await internApiRequest.updateIntern(
        row?.data.id,
        formattedData
      );
      toast({
        title: `${result.payload.message}`,
        duration: 2000,
        variant: "success",
      });
      console.log(result);
      onClose();
    } catch (error: any) {
      const errorRes = { error };
      const errorMessage =
        errorRes.error.payload.message || "Đã xảy ra lỗi, vui lòng thử lại";
      if (errorRes.error.payload.log.includes("duplicate data")) {
        const duplicates = errorRes.error.payload.log
          .match(/\[(.*?)\]/)[1]
          .split(", ");
        const newFieldErrors = { ...errors };

        duplicates.forEach((field: string) => {
          switch (field) {
            case "email":
              newFieldErrors.email = "Email đã tồn tại hoặc không hợp lệ";
              break;
            case "phone-number":
              newFieldErrors["phone-number"] =
                "Số điện thoại đã tồn tại hoặc không hợp lệ";
              break;
            case "user-name":
              newFieldErrors["user-name"] = "Tên người dùng đã tồn tại";
              break;
            case "student-code":
              newFieldErrors["student-code"] = "Mã sinh viên đã tồn tại";
              break;
            default:
              break;
          }
        });

        setErrors(newFieldErrors);
        setSubmitError(
          "Một số trường nhập liệu đã tồn tại hoặc không hợp lệ. Vui lòng kiểm tra lại."
        );
      } else {
        setSubmitError(errorMessage);
      }
      console.log(errorRes.error.payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box className="modal-box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sửa thực tập
          </Typography>

          <FormControl>
            <Grid container spacing={2} marginY={2}>
              <Grid item xs={4}>
                <FormControl fullWidth error={Boolean(errors["user-name"])}>
                  <TextField
                    label="Tên người dùng"
                    size="small"
                    value={formData["user-name"]}
                    onChange={handleChange("user-name")}
                    error={Boolean(errors["user-name"])}
                    helperText={errors["user-name"]}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth error={Boolean(errors.email)}>
                  <TextField
                    label="Email"
                    size="small"
                    value={formData.email}
                    onChange={handleChange("email")}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth error={Boolean(errors["student-code"])}>
                  <TextField
                    label="Mã sinh viên"
                    size="small"
                    value={formData["student-code"]}
                    onChange={handleChange("student-code")}
                    error={Boolean(errors["student-code"])}
                    helperText={errors["student-code"]}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth error={Boolean(errors["phone-number"])}>
                  <TextField
                    label="Số điện thoại"
                    size="small"
                    value={formData["phone-number"]}
                    onChange={handleChange("phone-number")}
                    error={Boolean(errors["phone-number"])}
                    helperText={errors["phone-number"]}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Địa chỉ"
                    size="small"
                    value={formData.address}
                    onChange={handleChange("address")}
                  />
                </FormControl>
              </Grid>

              {/* <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Avatar"
                    value={formData.avatar}
                    onChange={handleChange("avatar")}
                  />
                </FormControl>
              </Grid> */}

              <Grid item xs={4}>
                <FormControl fullWidth error={Boolean(errors.gender)}>
                  <InputLabel id="gender-label" shrink>
                    Giới tính
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender-select"
                    name="gender"
                    value={formData.gender}
                    size="small"
                    onChange={handleSelectChange}
                    label="Giới tính"
                    displayEmpty
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                  </Select>
                  <FormHelperText>{errors.gender}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <DatePicker
                    label="Ngày sinh"
                    format="DD/MM/YYYY"
                    value={
                      formData["date-of-birth"]
                        ? dayjs(formData["date-of-birth"])
                        : null
                    }
                    onChange={(date) => handleDateChange("date-of-birth", date)}
                    slotProps={{
                      textField: { fullWidth: true, size: "small" },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload">
                  <Button
                    component="span"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Avatar"}
                  </Button>
                </label>
                {formData.avatar && formData.avatar.startsWith("http") && (
                  <Box mt={2}>
                    <Image
                      src={formData.avatar}
                      alt="avatar"
                      width={150}
                      height={150}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <Box display="flex" justifyContent="flex-end">
            <FormHelperText error>{submitError}</FormHelperText>
            <Button
              variant="contained"
              color="warning"
              onClick={handleAdd}
              startIcon={<EditIcon />}
              disabled={loading}
            >
              {loading ? "Sửa..." : "Sửa thông tin"}
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default EditModal;
