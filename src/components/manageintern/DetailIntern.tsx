"use client";
import React, { useEffect } from "react";
import { Divider, Fade, Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Typography, Grid, Box, styled, Button } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import {
  InternByIdResType,
  InternSchemaType,
} from "@/schemaValidations/intern.schema";
import internApiRequest from "@/apiRequests/intern";
import EditModal from "@/components/manageintern/EditModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSkillIntern from "@/components/manageintern/AddSkillIntern";
import Image from "next/image";

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

const AvatarContainer = styled("div")({
  position: "relative",
  width: "100px",
  height: "100px",
  marginBottom: "16px",
  borderRadius: "100%",
  overflow: "hidden",
});

const DetailIntern = ({
  row,
  onClose,
}: {
  row: InternSchemaType;
  onClose: () => void;
}) => {
  const [detailIntern, setDetailIntern] = useState<InternByIdResType>();

  useEffect(() => {
    internApiRequest
      .getListInternById(row?.["intern-id"])
      .then(({ payload }) => {
        setDetailIntern(payload);
      });
  }, [row]);

  // update modal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const handleOpenUpdateModal = (data: any) => {
    setSelectedRow(data);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    onClose();
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
    onClose();
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
          Thông tin chi tiết thực tập
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
      <Box sx={{ flexGrow: 1, marginTop: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <ScrollArea className="h-[420px] w-[540px]">
              <Grid container spacing={3}>
                <Grid item xs={12} className="flex justify-center">
                  <AvatarContainer>
                    <div className="absolute inset-0 bg-gray-200 rounded-full ">
                      <Image
                        src={
                          detailIntern?.data.avatar
                            ? detailIntern.data.avatar.startsWith("http")
                              ? detailIntern.data.avatar
                              : "/images/avatar.jpg"
                            : "/images/avatar.jpg"
                        }
                        alt="Intern Avatar"
                        layout="fill"
                        objectFit="cover" priority
                        className="rounded-full"
                      />
                    </div>
                  </AvatarContainer>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Tên thực tập:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;{detailIntern?.data["user-name"]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Mã thực tập: </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;{detailIntern?.data["student-code"]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Email thực tập:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;{detailIntern?.data.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Giới tính:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;
                        {detailIntern?.data.gender !== "male" ? "Nữ" : "Nam"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Ngày sinh:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;
                        {dayjs(detailIntern?.data["date-of-birth"]).format(
                          "DD/MM/YYYY"
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Số điện thoại:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                      >
                        &#160;{detailIntern?.data["phone-number"]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Địa chỉ: </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        className="mt-1"
                        color="GrayText"
                        style={{ maxWidth: 550, wordBreak: "break-word" }}
                      >
                        &#160;{detailIntern?.data.address}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="h5">Kỹ năng:</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ marginTop: 2, width: "100%" }}>
                      <Box display="flex" flexDirection="column">
                        {detailIntern?.data["detail-skill"]?.map(
                          (skill, index) => (
                            <Grid container spacing={4} key={index}>
                              <Grid item xs={5}>
                                <Typography variant="h6" color="GrayText">
                                  &#160;{skill["technical-skill"]}
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <Typography color="GrayText">-</Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography
                                  variant="h6"
                                  // className="mt-1"
                                  color="GrayText"
                                >
                                  &#160;{skill["skill-level"]}
                                </Typography>
                              </Grid>
                            </Grid>
                          )
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ScrollArea>
          </Grid>
          <Grid item xs={1} sm={1}>
            <Divider orientation="vertical" variant="middle" />
          </Grid>
          <Grid item xs={11} sm={3}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Button
                  onClick={() => handleOpenUpdateModal(detailIntern)}
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
                  Thêm kĩ năng
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
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
            <EditModal
              row={selectedRow}
              onClose={handleCloseUpdateModal}
            ></EditModal>
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
            <AddSkillIntern
              id={detailIntern?.data.id}
              technicalList={detailIntern}
              handleClose={handleCloseAddPMModal}
            ></AddSkillIntern>
          </Box>
        </Fade>
      </Modal>
    </Div>
  );
};

export default DetailIntern;
