"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Typography,
  Grid,
  styled,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import SearchIcon from "@mui/icons-material/Search";
import ListTable from "@/components/manager/mainLayout/ListTable";
import { TaskFilterType } from "@/schemaValidations/task.schema";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const statusLabels: { [key: string]: string } = {
  todo: "Chưa bắt đầu",
  in_progress:"Đang thực hiện",
  completed: "Hoàn thành",
  true: "Đã duyệt",
  false: "Không duyệt",
};

const FilterList = () => {
  const [formData, setFormData] = useState<TaskFilterType>({
    name: "",
    status: "",
    "assignee-name": "",
    "assignee-code": "",
    "is-approved": "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<any | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsFilter(true);
    setDataFilter(formData);
    console.log(formData);
  }

  const handleReset = () => {
    setFormData({
      name: "",
      status: "",
      "assignee-name": "",
      "assignee-code": "",
      "is-approved": "",
    });
    setIsFilter(false);
    setDataFilter(null);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={1}>
          <Grid item xs={24}>
            <Accordion defaultExpanded>
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Tìm kiếm thông tin</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <TextField
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        id="name"
                        label="Tên công việc"
                        variant="standard"
                        size="small"
                        style={{ width: "90%", marginTop: 6 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <InputLabel id="status-label">Trạng thái</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleSelectChange(e, "status")}
                        displayEmpty
                        variant="standard"
                        size="small"
                        style={{ width: "90%" }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>Chọn trạng thái</em>;
                          }
                          return statusLabels[selected];
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Chọn trạng thái</em>
                        </MenuItem>
                        <MenuItem value="todo">Chưa bắt đầu</MenuItem>
                        <MenuItem value="in_progress">Đang thực hiện</MenuItem>
                        <MenuItem value="completed">Hoàn thành</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        name="assignee-name"
                        value={formData["assignee-name"]}
                        onChange={handleChange}
                        id="assignee-name"
                        label="Người được phân công"
                        variant="standard"
                        size="small"
                        style={{ width: "90%", marginTop: 6 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        name="assignee-code"
                        value={formData["assignee-code"]}
                        onChange={handleChange}
                        id="assignee-code"
                        label="Mã thực tập"
                        variant="standard"
                        size="small"
                        style={{ width: "90%", marginTop: 6 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <InputLabel id="is-approved-label">Tình trạng công việc</InputLabel>
                      <Select
                        labelId="is-approved-label"
                        id="is-approved"
                        value={formData["is-approved"]}
                        onChange={(e) => handleSelectChange(e, "is-approved")}
                        displayEmpty
                        variant="standard"
                        size="small"
                        style={{ width: "90%" }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>Chọn trạng thái</em>;
                          }
                          return statusLabels[selected];
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Chọn trạng thái</em>
                        </MenuItem>
                        <MenuItem value="true">Đã duyệt</MenuItem>
                        <MenuItem value="false">Không duyệt</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={4} style={{ width: "100%", marginTop: 10 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        style={{ width: "50%", marginTop: 4, marginRight: 5 }}
                      >
                        Tìm kiếm
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outlined"
                        style={{
                          width: "45%",
                          marginTop: 4,
                        }}
                      >
                        Hủy tìm kiếm
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </LocalizationProvider>
      <ListTable
      isFilter={isFilter}
      dataFilter={dataFilter}
      handleReset={handleReset}
      ></ListTable>
    </div>
  );
};

export default FilterList;
