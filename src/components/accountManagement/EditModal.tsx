import React, { useState, ChangeEvent, FormEvent, } from 'react';
import { useRouter } from "next/navigation";
import { Box, TextField, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { toast } from "@/components/ui/use-toast";
import '@/styles/accountManagement/ModalBox.css'
import { UpdateAccountType } from '@/schemaValidations/accountManagement/account.schema';
import { RowData } from './Table';
import accountApiRequest from '@/apiRequests/accountManagement/account';

interface EditModalAccountProps {
    onClose: () => void;
    row: RowData | undefined;
}

const EditModalAccount: React.FC<EditModalAccountProps> = ({ onClose, row }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<UpdateAccountType>({
        id: row?.id ?? '',
        email: row?.email ?? '',
        role: row?.role ?? '',
        "user-name": row?.["user-name"] ?? ''
    });

    console.log("selectedRow: ", formData);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, role: e.target.value });
    };


    async function handleSubmit(e: FormEvent) {
        if (loading) return;
        setLoading(true);
        e.preventDefault();

        try {
            const result = await accountApiRequest.updateAccount(formData);
            toast({
                title: `${result.payload.message}`,
                duration: 2000,
                variant: "success",
            });
            onClose();

        } catch (error: any) {
            const errorRes = { error };
            toast({
                title: `${errorRes.error.payload.message[0]['err-message']}`,
                duration: 4000,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box className="modal-edit-box">
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Cập nhật tài khoản
            </Typography>

            {formData && (
                <form>
                    <Grid container spacing={2} marginY={2}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Tên người dùng"
                                    placeholder="Tên người dùng"
                                    name='user-name'
                                    value={formData['user-name']}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ minLength: 4 }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Email"
                                    placeholder="Email"
                                    name='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="role-label" sx={{ fontSize: 14 }}>Role</InputLabel>
                                <Select
                                    name="role"
                                    labelId="role-label"
                                    value={formData.role}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <MenuItem value={"admin"}>Admin</MenuItem>
                                    <MenuItem value={"manager"}>Manager</MenuItem>
                                    <MenuItem value={"pm"}>Project Manager</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Cập nhật
                        </Button>
                        <Button
                            color="primary"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                    </Box>
                </form>
            )}
        </Box>
    )
}
export default EditModalAccount;