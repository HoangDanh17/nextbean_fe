'use client'
import React from 'react';
import { useState, ChangeEvent, FormEvent } from "react";
import { Input, Button, FormControl, Grid, Select, MenuItem, SelectChangeEvent, InputLabel, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Search } from '@mui/icons-material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import dayjs, { Dayjs } from "dayjs";
import TaskList, { FormFilterData } from './ListTable';

const FilterList = () => {
  const [formData, setFormData] = useState<FormFilterData>({
    name: "",
    status: "",
    "assignee-name": "",
    "assignee-code": "",
    "is-approved": ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleSelectApprove = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, "is-approved": e.target.value });
  };


  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<FormFilterData | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsFilter(true);
    setDataFilter(formData);
  }

  const handleReset = () => {
    setFormData({
      name: "",
      status: "",
      "assignee-name": "",
      "assignee-code": "",
      "is-approved": ""
    });
    setIsFilter(false);
    setDataFilter(null);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<FilterListOutlinedIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Bộ lọc
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Input
                    name='name'
                    placeholder="Tên task"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <Input
                    name='status'
                    placeholder="Trạng thái dự án"
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <Input
                    name='assignee-name'
                    placeholder="Thành viên được giao task"
                    value={formData['assignee-name']}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <Input
                    name='assignee-code'
                    placeholder="MSSV của người được giao task"
                    value={formData['assignee-code']}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="role-label" sx={{ fontSize: 14 }}>Trạng thái</InputLabel>
                    <Select
                      name="status"
                      labelId="role-label"
                      value={formData.status}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value={"todo"}>To Do</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="is-approved-label">Xác nhận</InputLabel>
                    <Select
                      name="is-approved"
                      labelId="is-approved-label"
                      label="Xác nhận"
                      value={formData["is-approved"]}
                      onChange={handleSelectApprove}
                    >
                      <MenuItem value="true">Approve</MenuItem>
                      <MenuItem value="false">Waiting</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid container item xs={12} sm={12} md={4} lg={4} spacing={1}>
                  <Grid item>
                    <Button className='clean-btn' onClick={handleReset}>
                      Xóa Filter
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button type="submit" variant="contained" startIcon={<Search />} className='search-btn'>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </AccordionDetails>
        </Accordion>
      </LocalizationProvider>

      <TaskList
        isFilter={isFilter}
        dataFilter={dataFilter}
      />
    </div>
  );
}

export default FilterList;