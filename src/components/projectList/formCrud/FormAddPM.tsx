"use client";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import projectApiRequest from "@/apiRequests/project";
import { RowData } from "@/components/projectList/DetailCard";
import { MemberInProjectResType } from "@/schemaValidations/project.schema";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

type Manager = {
  id: string | number;
  "user-name": string;
  email?: string;
  isOriginal?: boolean;
};

export default function FormAddPM({
  row,
  listMemberInProject,
  handleClose,
}: {
  row: RowData;
  listMemberInProject: MemberInProjectResType | undefined;
  handleClose: () => void;
}) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [availableManagers, setAvailableManagers] = useState<Manager[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<boolean[]>([]);

  useEffect(() => {
    if (listMemberInProject) {
      const originalManagers = listMemberInProject.data.map((m) => ({
        ...m,
        isOriginal: true,
      }));
      setManagers(originalManagers);
    }
  }, [listMemberInProject]);

  useEffect(() => {
    projectApiRequest.getListPMNotInProject(row.id).then(({ payload }) => {
      setAvailableManagers(payload.data);
    });
  }, []);

  const handleChange = (newValue: Manager | null, index: number) => {
    if (newValue) {
      const newManagers = [...managers];
      newManagers[index] = { ...newValue, isOriginal: false };
      setManagers(newManagers);
      const newErrors = [...validationErrors];
      newErrors[index] = false;
      setValidationErrors(newErrors);
    }
  };

  const handleAddManager = () => {
    const availableManager = availableManagers.find(
      (m) => !managers.some((existingM) => existingM.id === m.id)
    );

    if (availableManager) {
      setManagers([...managers, { ...availableManager, isOriginal: false }]);
      setValidationErrors([...validationErrors, false]);
    } else {
      setManagers([
        ...managers,
        { id: '', "user-name": '', email: '', isOriginal: false }
      ]);
      setValidationErrors([...validationErrors, true]);
    }
  };

  const handleDeleteManager = (index: number) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const newManagers = managers.filter((_, i) => i !== deleteIndex);
      setManagers(newManagers);
      const newErrors = [...validationErrors];
      newErrors.splice(deleteIndex, 1);
      setValidationErrors(newErrors);
      setDeleteIndex(null);
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    const newErrors = managers.map((manager) => !manager["user-name"]);
    if (newErrors.some((error) => error)) {
      setValidationErrors(newErrors);
      toast({
        title: "Vui lòng chọn tất cả quản lý dự án",
        duration: 2000,
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      "list-manager-id": managers.map((manager) => String(manager.id)),
    };
    projectApiRequest
      .addPmIntoProject(row.id, submitData)
      .then((response) => {
        toast({
          title: `${response.payload.message}`,
          duration: 2000,
          variant: "success",
        });
        handleClose();
      })
      .catch((error) => {
        toast({
          title: `${error}`,
          duration: 2000,
          variant: "destructive",
        });
      });
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="h4">Quản lý dự án</Typography>
      <Box sx={{maxHeight: 300,overflow:"auto"}}>
      {managers.map((manager, index) => (
        <Box
          display="flex"
          alignItems="center"
          key={index}
          style={{ marginTop: 20 }}
        >
          <Autocomplete
            disablePortal
            id={`manager-select-${index}`}
            options={manager.isOriginal ? [manager] : availableManagers}
            getOptionLabel={(option) => option["user-name"]}
            value={manager}
            onChange={(event, newValue) => handleChange(newValue, index)}
            disabled={manager.isOriginal}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Quản lý dự án"
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionDisabled={(option) =>
              managers.some((m) => m.id === option.id && m.id !== manager.id)
            }
            fullWidth
          />
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteManager(index)}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        </Box>
      ))}
      </Box>
      <Button
        onClick={handleAddManager}
        style={{
          marginTop: 20,
          width: "100%",
          backgroundColor: "#94a3b8",
          color: "#334155",
        }}
        startIcon={<AddIcon />}
      >
        Thêm quản lý
      </Button>

      <Button
        variant="contained"
        onClick={handleSubmit}
        style={{ marginTop: 20, float: "right" }}
      >
        Xác nhận
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa quản lý này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
