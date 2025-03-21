import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Box, TextField, Typography, Button, Grid, FormControl, SelectChangeEvent, InputLabel, Select, MenuItem } from "@mui/material"
import '@/styles/accountManagement/ModalBox.css';
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { CreateAccountType } from '@/schemaValidations/accountManagement/account.schema';
import accountApiRequest from '@/apiRequests/accountManagement/account';


interface AddModalProps {
    onClose: () => void;
}

const AddModalAccount: React.FC<AddModalProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<CreateAccountType>({
        email: "",
        password: "",
        role: "",
        "user-name": ""
    });

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
            const result = await accountApiRequest.createAccount(formData);
            toast({
                title: `${result.payload.message}`,
                duration: 2000,
                variant: "success",
            });
            console.log(result);
           // router.refresh();

        } catch (error: any) {
            console.log("erorAddL ", error)
            toast({
                title: `${error.payload.message}`,
                duration: 2000,
                variant: "destructive",
            });

        } finally {
            setLoading(false);
            onClose();
        }
    }

    return (
        <Box className="modal-add-box">
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Thêm tài khoản mới
            </Typography>

            <form onSubmit={handleSubmit}>
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
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <TextField
                                label="Mật khẩu"
                                placeholder="Mật khẩu"
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                inputProps={{ minLength: 6 }}
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
                        color="primary"
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        type='submit'
                    >
                        Tạo
                    </Button>
                </Box>
            </form>
        </Box>
    )
}
export default AddModalAccount;