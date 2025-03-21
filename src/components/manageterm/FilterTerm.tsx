"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Input,
  Button,
  FormControl,
  Grid,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TermTable, { RowData } from "./TermTable";

const Filter = () => {
  const [formData, setFormData] = useState<RowData>({
    semester: "",
    university: "",
    status: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<RowData | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData); // Added console.log
    setIsFilter(true);
    setDataFilter(formData);
  };

  const handleReset = () => {
    setFormData({
      semester: "",
      university: "",
      status: "",
    });
    setIsFilter(false);
    setDataFilter(null);
  };

  const statusLabels: { [key: string]: string } = {
    not_started: "Chưa bắt đầu",
    in_progress: "Đang diễn ra",
    completed: "Đã kết thúc",
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Accordion defaultExpanded>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Tìm kiếm thông tin</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="university"
                        placeholder="Trường Đại học"
                        value={formData.university}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="semester"
                        placeholder="Kỳ"
                        value={formData.semester}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3} style={{marginTop:4}}>
                    <FormControl fullWidth>
                      {/* <InputLabel id="status-label">Trạng thái</InputLabel> */}
                      <Select
                        labelId="status-label"
                        id="status"
                        value={formData.status}
                        onChange={handleSelectChange}
                        displayEmpty
                        variant="standard"
                        size="small"
                        style={{ width: "90%" }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>Chọn trạng thái</em>;
                          }
                          return statusLabels[selected];
                        }}
                      >
                        <MenuItem value="not_started">Chưa bắt đầu</MenuItem>
                        <MenuItem value="in_progress">Đang diễn ra</MenuItem>
                        <MenuItem value="completed">Đã kết thúc</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3} container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Search />}
                        className="search-btn"
                        fullWidth
                      >
                        Tìm kiếm
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleReset}
                        className="clean-btn"
                        fullWidth
                      >
                        Hủy Filter
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </FormControl>
            </form>
          </AccordionDetails>
        </Accordion>
      </LocalizationProvider>
      <TermTable
        isFilter={isFilter}
        dataFilter={dataFilter}
        handleReset={handleReset}
      />
    </>
  );
};

export default Filter;
