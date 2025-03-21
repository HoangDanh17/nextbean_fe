import React, { useEffect } from "react";
import {
  Avatar,
  AvatarGroup,
  Chip,
  Divider,
  Fade,
  Modal,
  Tooltip,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  TextField,
  Typography,
  Grid,
  Box,
  styled,
  Button,
} from "@mui/material";
import { useState } from "react";
import FormAddPM from "@/components/projectList/formCrud/FormAddPM";
import FormUpdate from "@/components/projectList/formCrud/FormUpdate";
import dayjs from "dayjs";
import { MemberInProjectResType } from "@/schemaValidations/project.schema";
import projectApiRequest from "@/apiRequests/project";

const Div = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export interface RowData {
  id: string;
  name: string;
  status: string;
  description: string;
  "est-start-time": Date;
  "est-completion-time": Date;
}

const DetailCard = ({
  row,
  handleCloseCard,
}: {
  row: RowData;
  handleCloseCard: () => void;
}) => {
  const [listMemberInProject, setListMemberInProject] =
    useState<MemberInProjectResType>();

  useEffect(() => {
    projectApiRequest.getListPMInProject(row.id).then(({ payload }) => {
      setListMemberInProject(payload);
    });
  }, []);

  // update modal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const handleOpenUpdateModal = (row: any) => {
    setSelectedRow(row);
    setOpenUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    handleCloseCard();
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "not_started":
        return { backgroundColor: "#FFB6C1", color: "white" }; // Màu hồng pastel đậm hơn
      case "in_progress":
        return { backgroundColor: "#87CEEB", color: "white" }; // Màu xanh dương pastel đậm hơn
      case "completed":
        return { backgroundColor: "#90EE90", color: "white" }; // Màu xanh lá pastel đậm hơn
      case "cancel":
        return { backgroundColor: "#FFA07A", color: "white" }; // Màu cam pastel đậm hơn
      default:
        return { backgroundColor: "#D3D3D3", color: "white" }; // Màu xám
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started":
        return "Chưa bắt đầu";
      case "in_progress":
        return "Đang thực hiện";
      case "completed":
        return "Hoàn thành";
      case "cancel":
        return "Hủy bỏ";
      default:
        return "Không xác định";
    }
  };
  
  // add PM

  const [openAddPMModal, setOpenAddPMModal] = useState(false);

  const [data, setData] = useState<any>(null);
  const handleOpenAddPMModal = (row: any) => {
    setData(row);
    setOpenAddPMModal(true);
  };

  const handleCloseAddPMModal = () => {
    setOpenAddPMModal(false);
    handleCloseCard();
  };

  return (
    <Div>
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography id="transition-modal-title" variant="h4" component="h2">
          Chi tiết dự án - Status:{" "}
          <Chip
            size="small"
            label={getStatusLabel(row.status)}
            sx={getStatusChipColor(row.status)}
          ></Chip>
        </Typography>
        <Typography
          id="transition-modal-title"
          variant="h4"
          component="h2"
          className="mr-8"
        >
          Hành động
        </Typography>
      </div>
      <form>
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="h5">Tên dự án:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;{row.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="h5">
                        Ngày dự kiến bắt đầu:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;
                        {dayjs(row["est-start-time"]).format("DD/MM/YYYY")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="h5">
                        Ngày dự kiến kết thúc:
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;
                        {dayjs(row["est-completion-time"]).format("DD/MM/YYYY")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="h5">Thông tin mô tả: </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                        style={{ maxWidth: 550, wordBreak: "break-word" }}
                      >
                        &#160;{row.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="h5" className="mt-1">
                        Quản lí dự án:{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <div className="flex break-words max-w-[350px]">
                        {listMemberInProject?.data.length !== 0 ? (
                          <AvatarGroup>
                            {listMemberInProject?.data.map((name, index) => (
                              <Tooltip title={name["user-name"]} key={index}>
                                <Avatar
                                  alt={name["user-name"]}
                                  src="/images/avatar.jpg"
                                />
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        ) : (
                          <Typography
                            variant="h6"
                            color="GrayText"
                            className="mt-2 break-words max-w-[350px]"
                          >
                            Chưa có quản lí
                          </Typography>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1} sm={1}>
              <Divider orientation="vertical" variant="middle" />
            </Grid>
            <Grid item xs={11} sm={3}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Button
                    onClick={() => handleOpenUpdateModal(row)}
                    variant="contained"
                    color="warning"
                    startIcon={<EditIcon></EditIcon>}
                    style={{ width: "100%", marginTop: 20 }}
                  >
                    Cập nhật
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenAddPMModal(row)}
                    style={{ width: "100%", marginTop: 6 }}
                  >
                    Thêm quản lí
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
      {/* Modal Edit */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openUpdateModal}>
          <Box sx={style}>
            <FormUpdate
              row={selectedRow}
              handleClose={handleCloseUpdateModal}
            ></FormUpdate>
          </Box>
        </Fade>
      </Modal>
      {/* Modal Add PM */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddPMModal}
        onClose={handleCloseAddPMModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAddPMModal}>
          <Box sx={style}>
            <FormAddPM
              row={data}
              listMemberInProject={listMemberInProject}
              handleClose={handleCloseAddPMModal}
            ></FormAddPM>
          </Box>
        </Fade>
      </Modal>
    </Div>
  );
};

export default DetailCard;
