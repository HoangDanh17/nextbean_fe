import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material"
import { toast } from "@/components/ui/use-toast";
import '@/styles/accountManagement/ModalBox.css'
import { RowData } from './Table';
import accountApiRequest from '@/apiRequests/accountManagement/account';

interface DeleteModalAccountProps {
    onClose: () => void;
    row: RowData | undefined;
}

const ConfirmDeleteModal: React.FC<DeleteModalAccountProps> = ({ onClose, row }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    //handle delete
    const handleDelete = async () => {
        if (row) {
            try {
                setLoading(true);
                await accountApiRequest.deleteAccount(row.id);
                toast({
                    title: `Delete account with ${row.id} successfully!`,
                    duration: 2000,
                    variant: "success",
                });

                // router.refresh();
            } catch (error: any) {
                toast({
                    title: `${error}`,
                    duration: 2000,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
                onClose();
            }
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}
        >
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Xác nhận xóa
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Bạn có chắc chắn muốn xóa account: {row?.['user-name']}?
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color='error'
                    onClick={handleDelete}
                    disabled={loading}
                    sx={{ mr: 1 }}
                >
                    {loading ? "Deleting..." : "Xóa"}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Hủy
                </Button>
            </Box>
        </Box>
    )
}
export default ConfirmDeleteModal;