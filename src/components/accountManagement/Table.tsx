"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  TablePagination,
  Radio,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import "@/styles/accountManagement/DataTable.css";
import {
  AccountListResType,
  AccountType,
} from "@/schemaValidations/accountManagement/account.schema";
import accountApiRequest from "@/apiRequests/accountManagement/account";
import dayjs from "dayjs";
import ButtonGroupAccount from "@/components/accountManagement/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditModalAccount from "./EditModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export interface FormFilterData {
  id: string;
  username: string;
  email: string;
  role: string;
  "created-at-from": string;
  "created-at-to": string;
}
export interface RowData {
  id: string;
  "user-name": string;
  email: string;
  role: string;
  "created-at": string;
}

function TableAccount({
  isFilter,
  dataFilter,
}: {
  isFilter: boolean;
  dataFilter: FormFilterData | null;
}) {
  const [data, setData] = React.useState<AccountListResType | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedValue, setSelectedValue] = React.useState<RowData>();
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  // handle edit
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const [refreshKey, setRefreshKey] = React.useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setSelectedValue(undefined);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditModal = (row: RowData) => {
    setSelectedValue(row);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    triggerRefresh();
  };

  // handle delete
  const handleOpenDeleteModal = (row: RowData) => {
    setSelectedValue(row);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    triggerRefresh();
  };

  // handle close for all
  const closeButNotRefresh = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
  };

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await accountApiRequest.getListAccount(
          page + 1,
          rowsPerPage,
          isFilter ? dataFilter : {}
        );
        setData(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isFilter, page, rowsPerPage, dataFilter, refreshKey]);

  return (
    <div style={{ maxHeight: 762, width: "100%", marginTop: "10px" }}>
      <TableContainer component={Paper}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Table sx={{ minWidth: 640 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên Người Dùng</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Ngày tạo</StyledTableCell>
                <StyledTableCell align="center">Hành động</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.data.map((account, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{account["user-name"]}</StyledTableCell>
                  <StyledTableCell>{account.email}</StyledTableCell>
                  <StyledTableCell>{account.role}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(account["created-at"]).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      style={{ marginRight: "10px" }}
                      variant="contained"
                      color="warning"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEditModal(account)}
                    >
                      Cập nhật
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleOpenDeleteModal(account)}
                    >
                      Xóa
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data?.paging.items || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="custom-row custom-pagination"
      />
      <ButtonGroupAccount triggerRefresh={triggerRefresh} />

      {/* Modal Edit */}
      <Modal open={openEditModal} onClose={closeButNotRefresh}>
        <EditModalAccount onClose={handleCloseEditModal} row={selectedValue} />
      </Modal>

      {/* Modal Confirm Delete */}
      <Modal open={openDeleteModal} onClose={closeButNotRefresh}>
        <ConfirmDeleteModal
          onClose={handleCloseDeleteModal}
          row={selectedValue}
        />
      </Modal>
    </div>
  );
}
export default TableAccount;
