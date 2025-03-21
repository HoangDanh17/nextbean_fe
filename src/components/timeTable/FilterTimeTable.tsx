"use client";
import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import ListTimeTable from "@/components/timeTable/ListTimeTable";

const FilterTimeTable = ({
  selectedDay,
  selectedDayName,
}: {
  selectedDay: Dayjs | null | undefined;
  selectedDayName: string;
}) => {
  const [status, setStatus] = useState("all");

  const handleStatusChange = (event: any) => {
    const { value } = event.target;
    setStatus(value);
    console.log("Status changed to:", value);
  };

  useEffect(() => {
    if (selectedDay) {
      console.log("Selected day is:", selectedDay.format("YYYY-MM-DD"));
    }
  }, [selectedDay]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography component="span" variant="h5">
          {selectedDayName},{" "}
          {selectedDay ? selectedDay.format("DD/MM/YYYY") : ""}
        </Typography>
        <FormControl margin="normal" style={{ minWidth: 200 }}>
          <InputLabel id="verified-label">Trạng thái</InputLabel>
          <Select
            labelId="verified-label"
            id="verified"
            size="small"
            name="verified"
            value={status}
            onChange={handleStatusChange}
            label="Trạng thái"
            defaultValue=""
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="processing">Đang đợi</MenuItem>
            <MenuItem value="denied">Từ chối</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ListTimeTable status={status} selectedDay={selectedDay} />
    </LocalizationProvider>
  );
};

export default FilterTimeTable;
