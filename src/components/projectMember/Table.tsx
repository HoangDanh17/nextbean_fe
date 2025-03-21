import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
} from "@mui/material";
import MemberInfoModal from "./MemberInfoModal";
import {
  ProjectMemberListResType,
  ProjectMemberType,
} from "@/schemaValidations/projectMember/projectMember.schema";
import "@/styles/accountManagement/DataTable.css";
import projectMemberApiRequest from "@/apiRequests/projectMember/projectMember";
import { toast } from "@/components/ui/use-toast";
import { useAppContext } from "@/app/app-provider";
import ButtonAdd from "./Button";

const StyledCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

const CenteredAvatarCell = styled(TableCell)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export interface FormFilter {
  "user-name": string;
  "student-code": string;
  semester: string;
  university: string;
}

function TableProjectMember({
  isFilter,
  dataFilter,
  selectedProjectId,
}: {
  isFilter: boolean;
  dataFilter: FormFilter | null;
  selectedProjectId?: string | undefined;
}) {
  const [selectedMember, setSelectedMember] =
    useState<ProjectMemberType | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [members, setMembers] = useState<ProjectMemberListResType | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const { project } = useAppContext();
  console.log(project);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchMembers = (projectId: string) => {
    setLoading(true);
    projectMemberApiRequest
      .getMemberInProject(
        projectId,
        page + 1,
        rowsPerPage,
        isFilter ? dataFilter : {}
      )
      .then(({ payload }) => {
        setMembers(payload);
      })
      .catch((error) => {
        console.error("Failed to fetch project members", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchMembers(selectedProjectId);
    }
  }, [selectedProjectId, page, rowsPerPage, isFilter, dataFilter, refreshKey]);

  const handleClickOpen = (member: ProjectMemberType) => {
    setSelectedMember(member);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMember(null);
  };

  // Open confirm modal
  const handleDelete = (member: ProjectMemberListResType["data"][0]) => {
    setConfirmOpen(true);
    setSelectedMember(member);
  };

  const confirmDelete = async () => {
    if (selectedMember) {
      try {
        const result = await projectMemberApiRequest.deleteMemberInProject(
          selectedProjectId,
          selectedMember.id
        );
        console.log(result);
        toast({
          title: `${result.payload.message}`,
          duration: 2000,
          variant: "success",
        });
      } catch (error: any) {
        const errorRes = { error };
        toast({
          title: `${errorRes.error.payload.message}`,
          duration: 4000,
          variant: "destructive",
        });
      } finally {
        setOpen(false);
        setConfirmOpen(false);
        setSelectedMember(null);
        triggerRefresh();
      }
    }
  };

  const cancelDelete = () => {
    setOpen(false);
    setSelectedMember(null);
    setConfirmOpen(false);
  };

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
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 640 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledCell>Avatar</StyledCell>
              <StyledCell>Tên Thành Viên</StyledCell>
              <StyledCell>Mã số sinh viên</StyledCell>
              <StyledCell>Trạng thái</StyledCell>
              {/* <StyledCell>Kỳ thực tập</StyledCell>
              <StyledCell>Kỹ năng công nghệ</StyledCell> */}
              <StyledCell>Hành động</StyledCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {members?.data?.map((member) => (
              <StyledRow key={member.id}>
                <CenteredAvatarCell>
                  <Avatar src={member.avatar} sx={{ width: 45, height: 45 }} />
                </CenteredAvatarCell>
                <StyledCell>{member["user-name"]}</StyledCell>
                <StyledCell>{member["student-code"]}</StyledCell>
                <StyledCell>
                  <Chip
                    size="small"
                    label={getStatusLabel(member.status)}
                    sx={getStatusChipColor(member.status)}
                  ></Chip>
                </StyledCell>
                {/* <StyledCell>{member['ojt-semester-university']}</StyledCell>
                <StyledCell>{member.technical_skills}</StyledCell> */}

                <StyledCell>
                  <Button size="small" onClick={() => handleClickOpen(member)}>
                    Click
                  </Button>
                </StyledCell>
              </StyledRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={members?.paging.items || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="custom-row custom-pagination"
      />

      {/* ButtonAdd Component */}
      <ButtonAdd
        triggerRefresh={triggerRefresh}
        selectedProjectId={selectedProjectId}
        isFilter={isFilter}
        dataFilter={dataFilter}
      />

      <MemberInfoModal
        open={open}
        handleClose={handleClose}
        selectedMember={selectedMember}
        handleDelete={handleDelete}
      />

      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thành viên này không?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TableProjectMember;
