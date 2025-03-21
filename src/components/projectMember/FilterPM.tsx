'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, FormControl, MenuItem, InputLabel } from '@mui/material';
import { Search } from '@mui/icons-material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import "@/styles/projectMember/Filter.css"
import TableForPM from './TablePM';
import { FormFilter } from './TablePM';
import termApiRequest from '@/apiRequests/term';

interface FilterProjectMemberProps {
    selectedProjectId: string | undefined;
}

type School = {
    id: string | number;
    university: string;
    semester: string;
};

const ProjectMemberPM: React.FC<FilterProjectMemberProps> = ({ selectedProjectId }) => {
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [dataFilter, setDataFilter] = useState<FormFilter | null>(null);
    const [school, setSchool] = useState<School[]>([]);

    const [formData, setFormData] = useState<FormFilter>({
        "user-name": "",
        "student-code": "",
        semester: "",
        university: "",
    });

    
    // Get list School when select
    useEffect(() => {
        termApiRequest.getTerm()
            .then(({ payload }) => {
                setSchool(payload.data);
            })
            .catch(error => {
                console.error("Failed to fetch projects", error);
            });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const handleSemesterChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, semester: e.target.value });
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsFilter(true);
        setDataFilter(formData);
    }

    const handleReset = () => {
        setFormData({
            "user-name": "",
            "student-code": "",
            semester: "",
            university: "",
        });
        setIsFilter(false);
        setDataFilter(null);
    };


    return (
        <div>
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
                            <Grid item xs={4}>
                                <TextField
                                    variant="standard"
                                    name='user-name'
                                    placeholder="Tên thành viên"
                                    value={formData['user-name']}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    variant="standard"
                                    name='student-code'
                                    placeholder="MSSV"
                                    value={formData['student-code']}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={4}>
                                {/* <FormControl variant="standard" fullWidth>
                                    <InputLabel id="school-label" sx={{ fontSize: 14 }}>Trường Đại học</InputLabel>
                                    <Select
                                        labelId="school-label"
                                        label="Trường Đại học"
                                        value={formData.university}
                                        onChange={handleSchoolChange}
                                    >
                                        {school.map((school) => (
                                            <MenuItem key={school.id} value={school.university}>
                                                {school.university}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> */}

                                <TextField
                                    variant="standard"
                                    name='university'
                                    placeholder="Trường Đại Học"
                                    value={formData.university}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="ojt-label" sx={{ fontSize: 14 }}>Kỳ OJT</InputLabel>
                                    <Select
                                        labelId="ojt-label"
                                        label="Kỳ OJT"
                                        value={formData.semester}
                                        onChange={handleSemesterChange}
                                    >
                                        {school.map((semester) => (
                                            <MenuItem key={semester.id} value={semester.semester}>
                                                {semester.semester}
                                            </MenuItem>

                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid container item xs={12} sm={12} md={4} lg={4} spacing={1}>
                                <Grid item xs={6}>
                                    <Button fullWidth type="submit" variant="contained" startIcon={<Search />} className='search-btn'>
                                        Search
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button fullWidth className='clean-btn' onClick={handleReset}>
                                        Xóa Filter
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </AccordionDetails>
            </Accordion>

            <Grid sx={{ marginTop: "10px" }}>
                <TableForPM
                    isFilter={isFilter}
                    dataFilter={dataFilter}
                    selectedProjectId={selectedProjectId}
                />
            </Grid>
        </div>
    );
};

export default ProjectMemberPM;