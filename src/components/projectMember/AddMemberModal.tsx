'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    Modal, Box, Grid, Table, TableBody, TableCell, TableContainer, Input, Radio, Tooltip, InputLabel,
    TableHead, TableRow, Paper, Typography, Button, CircularProgress, AvatarGroup, Avatar, FormControl, MenuItem
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Search } from '@mui/icons-material';
import { ScrollArea } from "@/components/ui/scroll-area"
import projectMemberApiRequest from '@/apiRequests/projectMember/projectMember';
import { MemberNotInProListResType } from '@/schemaValidations/projectMember/projectMember.schema';
import { toast } from "@/components/ui/use-toast";
import termApiRequest from '@/apiRequests/term';

type Member = {
    id: string,
    "user-name": string,
    "student-code": string,
    avatar: string,
    "ojt-semester-university": string,
    "technical_skills": string,
};

export interface FormFilterData {
    "user-name": string,
    "student-code": string,
    semester: string,
    university: string,
}

type School = {
    id: string | number;
    university: string;
    semester: string;
};

function AddMemberModal({
    open,
    onClose,
    selectedProjectId,
    Filter,
    DataFilter
}: {
    open: boolean;
    onClose: () => void;
    selectedProjectId: string | undefined;
    Filter: boolean;
    DataFilter: FormFilterData | null;

}) {
    const [member, setMember] = useState<MemberNotInProListResType | null>(null);
    const [quantity, setQuantity] = useState(5);
    const [loading, setLoading] = React.useState(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [dataFilter, setDataFilter] = useState<FormFilterData | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [refreshKey, setRefreshKey] = useState(false);

    // Get list member not in project
    useEffect(() => {
        if (selectedProjectId) {
            projectMemberApiRequest.getMemberNotInProject(
                selectedProjectId,
                quantity,
                isFilter ? dataFilter : {}
            )
                .then(({ payload }) => {
                    setMember(payload);

                })
                .catch(error => {
                    console.error("Failed to fetch project members", error);
                });
        }
    }, [selectedProjectId, isFilter, dataFilter, quantity, refreshKey]);


    console.log("Thành viên: ", member)

    // Filter
    const [school, setSchool] = useState<School[]>([]);

    const [formData, setFormData] = useState<FormFilterData>({
        "user-name": "",
        "student-code": "",
        semester: "",
        university: ""
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

    const handleSemesterChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, semester: e.target.value });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        setIsFilter(true);
        setDataFilter(formData);
    }

    const handleResetFilter = () => {
        setFormData({
            "user-name": "",
            "student-code": "",
            semester: "",
            university: ""
        });
        setIsFilter(false);
        setDataFilter(null);
        setQuantity(5);
    };

    // Handle load member not in project
    const handleLoadMore = () => setQuantity(quantity + 5);

    // Handle Select
    const handleSelectMember = (selectedMember: Member) => {
        setSelectedMembers([selectedMember]);
    };

    // Handle cancel add member
    const resetAndClose = () => {
        setFormData({
            "user-name": "",
            "student-code": "",
            semester: "",
            university: ""
        });
        setSelectedMembers([]);
        onClose();
        setQuantity(5);
    };

    // Handle add 
    const handleAdd = (selectedMembers: Member[]) => {
        const memberIds = selectedMembers.map((member) => member.id);

        const submitData = {
            "member-id": String(memberIds),
        };

        projectMemberApiRequest.addMemberIntoProject(selectedProjectId, submitData)
            .then((response) => {
                toast({
                    title: `${response.payload.message}`,
                    duration: 2000,
                    variant: "success",
                });
                setRefreshKey(!refreshKey);
                resetAndClose();
            })
            .catch((error) => {
                const errorRes = { error };
                toast({
                    title: `${errorRes.error.payload.message}`,
                    duration: 4000,
                    variant: "destructive",
                });
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: '80%', margin: 'auto', marginTop: '5%', padding: 2, backgroundColor: 'white' }}>
                <Typography variant="h6" gutterBottom>
                    Thêm thành viên vào dự án
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* Filter */}
                        <form onSubmit={handleFilter}>
                            <Grid container spacing={2} sx={{ mb: 1, mt: 2 }}>
                                <Grid item xs={3}>
                                    <Input
                                        name='user-name'
                                        placeholder="Tên thành viên"
                                        value={formData['user-name']}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Input
                                        name='student-code'
                                        placeholder="MSSV"
                                        value={formData['student-code']}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <Input
                                        name='university'
                                        placeholder="Trường Đại học"
                                        value={formData.university}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl variant="outlined" fullWidth>
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

                                <Grid item xs={3}>
                                    <Button type="submit" variant="contained" startIcon={<Search />} className='search-btn'>
                                        Search
                                    </Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button className='clean-btn' onClick={handleResetFilter}>
                                        Xóa Filter
                                    </Button>
                                </Grid>

                            </Grid>
                        </form>

                        <TableContainer component={Paper}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Table>
                                    {/* <TableHead>
                                        <TableRow>
                                            <TableCell>Chọn</TableCell>
                                            <TableCell>Thành viên</TableCell>
                                        </TableRow>
                                    </TableHead> */}
                                    <ScrollArea className="h-[300px] ">
                                        <TableBody>
                                            {member?.data.map((member) => (
                                                <TableRow key={member.id} hover>
                                                    <TableCell padding="checkbox">
                                                        <Radio
                                                            color="primary"
                                                            checked={selectedMembers.length > 0 && selectedMembers[0].id === member.id}
                                                            onChange={() => handleSelectMember(member)}
                                                        />
                                                    </TableCell>

                                                    <TableCell>{member['user-name']}</TableCell>
                                                    <TableCell>{member['student-code']}</TableCell>
                                                    <TableCell>{member['ojt-semester-university']}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </ScrollArea>
                                </Table>
                            )}
                        </TableContainer>

                        {!loading && member?.data && member.data.length >= quantity && (
                            <div className="flex justify-center">
                                <Button onClick={handleLoadMore} style={{ marginTop: 10 }}>
                                    Load More
                                </Button>
                            </div>
                        )}

                    </Grid>

                    <Grid item xs={6}>
                        {selectedMembers.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="h6">
                                                    Thành viên đã được chọn
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <ScrollArea className="h-[450px] rounded-md border">
                                        <TableBody>
                                            {selectedMembers.map((member) => (
                                                <TableRow key={member.id}>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">
                                                            Tên: <Typography component="span" variant="subtitle1" fontWeight="bold">{member['user-name']}</Typography>
                                                        </Typography>
                                                        <Typography variant="subtitle1">
                                                            MSSV: <Typography component="span" variant="subtitle1" fontWeight="bold">{member['student-code']}</Typography>
                                                        </Typography>
                                                        <Typography variant="subtitle1">
                                                            Kỳ OJT: <Typography component="span" variant="subtitle1" fontWeight="bold">{member['ojt-semester-university']}</Typography>
                                                        </Typography>
                                                        <Typography variant="subtitle1">
                                                            Kỹ năng công nghệ: <Typography component="span" variant="subtitle1" fontWeight="bold">{member.technical_skills}</Typography>
                                                        </Typography>

                                                        <Box sx={{ marginTop: 1 }} display="flex" flexDirection="column" alignItems="flex-start">
                                                            <Typography variant="h6">Hình ảnh </Typography>
                                                            <AvatarGroup>
                                                                {/* {listImage?.data.map((image, index) => ( */}
                                                                <Tooltip title="tam">
                                                                    <Avatar
                                                                        //alt={image['user-name']}
                                                                        src={member.avatar}
                                                                        style={{ width: 70, height: 70 }}
                                                                    />
                                                                </Tooltip>
                                                                {/* ))} */}
                                                            </AvatarGroup>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </ScrollArea>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="h6">Chưa có thành viên nào được chọn</Typography>
                        )}
                        <Button onClick={resetAndClose} variant="contained" color="error" sx={{ mt: 2, mr: 1 }}>
                            Hủy
                        </Button>
                        <Button
                            onClick={() => handleAdd(selectedMembers)}
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Thêm
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal >
    );
};

export default AddMemberModal;