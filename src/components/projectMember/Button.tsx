'use client'
import * as React from 'react';
import { Button, Card, CardContent } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import "@/styles/accountManagement/ButtonGroup.css";
import AddMemberModal from './AddMemberModal';
import { FormFilter } from './Table';
import { useRouter } from 'next/navigation';

interface ButtonGroupAccountProps {
    triggerRefresh: () => void;
    selectedProjectId: string | undefined;
    isFilter: boolean;
    dataFilter: FormFilter | null;
}

const ButtonAdd: React.FC<ButtonGroupAccountProps> = ({ triggerRefresh, selectedProjectId, isFilter, dataFilter }) => {
    const [openAddModal, setOpenAddModal] = React.useState(false);

    const handleOpenAddModal = () => setOpenAddModal(true);

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        triggerRefresh();
    }

    const router = useRouter();

    return (
        <Card style={{ marginTop: "10px" }}>
            <CardContent style={{ height: "68px" }}>
                <Button
                    onClick={handleOpenAddModal}
                    variant="contained"
                    startIcon={<AddIcon />}
                    className='search-btn'
                >
                    Thêm thành viên
                </Button>

                <Button 
                onClick={() => router.back()} 
                variant="contained"
                color='error'
                style={{marginLeft: 5}}
                >
                    Quay lại danh sách dự án
                </Button>


            </CardContent>

            <AddMemberModal
                Filter={isFilter}
                DataFilter={dataFilter}
                open={openAddModal}
                onClose={handleCloseAddModal}
                selectedProjectId={selectedProjectId}
            />
        </Card>
    )
}

export default ButtonAdd;
