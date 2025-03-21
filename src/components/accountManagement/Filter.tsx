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
import TableAccount, { FormFilterData } from './Table';
import dayjs, { Dayjs } from "dayjs";

const FilterAccount = () => {
    const [formData, setFormData] = useState<FormFilterData>({
        id: "",
        username: "",
        email: "",
        role: "",
        "created-at-from": "",
        "created-at-to": "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, role: e.target.value });
    };

    const handleDateChange = (name: string, date: Dayjs | null) => {
        setFormData({
            ...formData,
            [name]: date ? date.format("YYYY-MM-DD") : "",
        });
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
            id: "",
            username: "",
            email: "",
            role: "",
            "created-at-from": "",
            "created-at-to": "",
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
                                        name='username'
                                        placeholder="Tên người dùng"
                                        value={formData.username}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <Input
                                        id='email'
                                        name='email'
                                        placeholder="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <DatePicker
                                            label="Ngày tạo từ"
                                            value={
                                                formData['created-at-from']
                                                    ? dayjs(formData['created-at-from'])
                                                    : null
                                            }
                                            onChange={(date) =>
                                                handleDateChange("created-at-from", date)
                                            }
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <DatePicker
                                            label="Ngày tạo đến"
                                            value={
                                                formData['created-at-to']
                                                    ? dayjs(formData['created-at-to'])
                                                    : null
                                            }
                                            onChange={(date) =>
                                                handleDateChange("created-at-to", date)
                                            }
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="role-label" sx={{ fontSize: 14 }}>Role</InputLabel>
                                        <Select
                                            name="role"
                                            labelId="role-label"
                                            value={formData.role}
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value={"admin"}>Admin</MenuItem>
                                            <MenuItem value={"manager"}>Manager</MenuItem>
                                            <MenuItem value={"pm"}>Project Manager</MenuItem>
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
                        </form>
                    </AccordionDetails>
                </Accordion>
            </LocalizationProvider>

            <TableAccount
                isFilter={isFilter}
                dataFilter={dataFilter}
            />
        </div>
    );
}

export default FilterAccount;