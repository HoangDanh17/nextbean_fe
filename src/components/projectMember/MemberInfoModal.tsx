import React from "react";
import {
  Modal,
  Button,
  Typography,
  FormControl,
  Grid,
  Avatar,
  AvatarGroup,
  Tooltip,
  Chip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "@/styles/projectMember/InfoModal.css";
import { ProjectMemberListResType } from "@/schemaValidations/projectMember/projectMember.schema";
import { useAppContext } from "@/app/app-provider";

interface MemberInfoModalProps {
  open: boolean;
  handleClose: () => void;
  selectedMember: any;
  handleDelete: (member: any) => void;
}

const MemberInfoModal: React.FC<MemberInfoModalProps> = ({
  open,
  handleClose,
  selectedMember,
  handleDelete,
}) => {
  const [listImage, setListImage] = React.useState<ProjectMemberListResType>();
  const { user } = useAppContext();
  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return { backgroundColor: "#87CEEB", color: "white" }; // Màu xanh dương pastel đậm hơn
      case "terminated":
        return { backgroundColor: "#FFA07A", color: "white" }; // Màu cam pastel đậm hơn
      default:
        return { backgroundColor: "#D3D3D3", color: "white" }; // Màu xám
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "Đang hoạt động";
      case "terminated":
        return "Dừng hoạt động";
      default:
        return "Không xác định";
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-detail-box">
        {selectedMember && (
          <FormControl>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Thông tin thành viên
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Avatar
                  src={selectedMember.avatar}
                  className="centered-avatar"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Tên:{" "}
                  <Typography component="span" fontWeight="bold">
                    {" "}
                    {selectedMember["user-name"]}
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  MSSV:{" "}
                  <Typography component="span" fontWeight="bold">
                    {" "}
                    {selectedMember["student-code"]}
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Kỳ OJT:{" "}
                  <Typography component="span" fontWeight="bold">
                    {" "}
                    {selectedMember["ojt-semester-university"]}
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Kỹ năng công nghệ:{" "}
                  <Typography component="span" fontWeight="bold">
                    {" "}
                    {selectedMember.technical_skills}
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Trạng thái:{" "}
                  <Chip
                    size="small"
                    label={getStatusLabel(selectedMember.status)}
                    sx={getStatusChipColor(selectedMember.status)}
                  ></Chip>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(selectedMember)}
                    color="error"
                    style={{
                      display:
                        selectedMember.status === "terminated" ||
                        user?.role === "admin"
                          ? ""
                          : "none",
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Dừng hoạt động
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </FormControl>
        )}
      </div>
    </Modal>
  );
};

export default MemberInfoModal;
