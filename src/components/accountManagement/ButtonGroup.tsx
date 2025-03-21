'use client'
import * as React from 'react';
import { Button, Card, CardContent, Modal } from "@mui/material";
import "@/styles/accountManagement/ButtonGroup.css";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddModalAccount from './AddAccountModal';
interface ButtonGroupAccountProps {
    triggerRefresh: () => void;
}

const ButtonGroupAccount: React.FC<ButtonGroupAccountProps> = ({ triggerRefresh }) => {

    //useState Modal Add
    const [openAddModal, setOpenAddModal] = React.useState(false);
    const handleOpenAddModal = () => setOpenAddModal(true);

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        triggerRefresh();
    }

    // handle close for all
    const closeForAll = () => {
        setOpenAddModal(false);
    }

    return (
        <Card style={{ marginTop: "10px" }}>
            <CardContent style={{ height: "68px" }}>

                <Button
                    variant="contained"
                    className="add-btn"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleOpenAddModal}
                >
                    Tạo mới
                </Button>


                {/* Modal Add */}
                <Modal
                    open={openAddModal}
                    onClose={closeForAll}
                >
                    <AddModalAccount onClose={handleCloseAddModal} />
                </Modal>
            </CardContent>
        </Card>
    )
}

export default ButtonGroupAccount;