'use client'
import * as React from 'react';
import { Button, Card, CardContent, Modal, Box, Typography } from "@mui/material";
import "@/styles/accountManagement/ButtonGroup.css";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CreateTaskModal from './CreateTaskModal';

interface ButtonTaskProps {
    triggerRefresh: () => void;
}

const ButtonTask: React.FC<ButtonTaskProps> = ({triggerRefresh }) => {
    const [loading, setLoading] = React.useState(false);

    //useState Modal Add
    const [openAddModal, setOpenAddModal] = React.useState(false);
    const handleOpenAddModal = () => setOpenAddModal(true);
    
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        triggerRefresh();
    }
    
    // handle close for all
    const closeForAll = () => {
        setOpenAddModal(false)
    }

    return (
        <Card style={{ marginTop: "5px" }}>
            <CardContent style={{ height: "68px" }}>
                <Button
                    variant="contained"
                    className="add-btn"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleOpenAddModal}
                >
                    Thêm
                </Button>
            
                {/* Modal Add */}
                <Modal
                    open={openAddModal}
                    onClose={closeForAll}

                >
                    <CreateTaskModal onClose={handleCloseAddModal} />
                </Modal>
            </CardContent>
        </Card>
    )
}

export default ButtonTask;