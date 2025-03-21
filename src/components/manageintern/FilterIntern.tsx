"use client"; // Add this line at the top

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Input,
  Button,
  FormControl,
  Grid,
  SelectChangeEvent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InternTable, { FormFilterData } from "./InternTable";

const FilterIntern = ({ id, name }: { id: number; name: string }) => {
  const [formData, setFormData] = useState<FormFilterData>({
    "user-name": "",
    email: "",
    "student-code": "",
    "ojt-semester": name,
    gender: "",
    "phone-number": "",
    address: "",
  });

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<FormFilterData | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setIsFilter(true);
    setDataFilter(formData);
  };

  const handleReset = () => {
    setFormData({
      "user-name": "",
      email: "",
      "student-code": "",
      "ojt-semester": name,
      gender: "",
      "phone-number": "",
      address: "",
    });
    setIsFilter(false);
    setDataFilter(null);
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
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="user-name"
                        placeholder="Tên người dùng"
                        value={formData["user-name"]}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="email"
                        placeholder="Email"
                        value={formData.email.trim()}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="student-code"
                        placeholder="Mã số sinh viên"
                        value={formData["student-code"]}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="gender"
                        placeholder="Giới tính"
                        value={formData.gender}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="phone-number"
                        placeholder="Số điện thoại"
                        value={formData["phone-number"]}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid> */}
                  {/* <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Input
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid container item xs={12} sm={12} md={4} lg={4} spacing={1}>
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
                        onClick={handleReset}
                        className="clean-btn"
                        fullWidth
                        variant="outlined"
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
      <InternTable
        id={id}
        name={name}
        isFilter={isFilter}
        dataFilter={dataFilter}
        handleReset={handleReset}
      />
    </>
  );
};

export default FilterIntern;
