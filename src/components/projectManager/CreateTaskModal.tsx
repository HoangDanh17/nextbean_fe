import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  SelectChangeEvent,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "@/styles/accountManagement/ModalBox.css";
import { toast } from "@/components/ui/use-toast";
import listTaskApiRequest from "@/apiRequests/listTask/listTask";
import { CreateTaskType } from "@/schemaValidations/listTask/listTask.schema";
import { useAppContext } from "@/app/app-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddModalProps {
  onClose: () => void;
}

export type Member = {
  id: string | number;
  "user-name": string;
};

const CreateTaskModal: React.FC<AddModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  // List Member
  const [member, setMember] = useState<Member[]>([]);

  const { project } = useAppContext();
  const [estimatedEffortError, setEstimatedEffortError] = useState(false);
  // Get list member in project
  useEffect(() => {
    listTaskApiRequest
      .getMemberInProject(project?.id)
      .then(({ payload }) => {
        setMember(payload.data);
      })
      .catch((error) => {
        console.error("Failed to fetch projects", error);
      });
  }, []);

  const [formData, setFormData] = useState<CreateTaskType>({
    "assigned-to": "",
    description: "",
    "estimated-effort": 1,
    name: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, "assigned-to": e.target.value });
  };

  async function handleSubmit(e: FormEvent) {
    if (loading) return;
    setLoading(true);
    e.preventDefault();
    if (formData["estimated-effort"] < 1) {
      setEstimatedEffortError(true);
      return;
    }
    setEstimatedEffortError(false);
    const submittedData = {
      ...formData,
      "estimated-effort": Number(formData["estimated-effort"]),
    };
    try {
      const result = await listTaskApiRequest.createTask(
        project?.id,
        submittedData
      );
      toast({
        title: `${result.payload.message}`,
        duration: 2000,
        variant: "success",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: `${error}`,
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <Box className="modal-add-box">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Tạo task mới
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <TextField
                label="Tên công việc"
                placeholder="Tên công việc"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <TextField
                type="number"
                label="Thời gian dự tính hoàn thành (giờ)"
                placeholder="Thời gian dự tính hoàn thành (giờ)"
                name="estimated-effort"
                value={formData["estimated-effort"]}
                onChange={handleChange}
                required
                error={estimatedEffortError}
                helperText={
                  estimatedEffortError ? "Thời gian dự tính phải lớn hơn 1" : ""
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="demo-simple-select-label">
                Người được giao
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="assigned-to"
                label="Người được giao"
                value={formData["assigned-to"]}
                onChange={handleSelectChange}
              >
                {member.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member["user-name"]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={24}>
            <FormControl fullWidth>
              <TextField
                label="Mô tả công việc"
                placeholder="Mô tả công việc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" className="cancel-btn" onClick={onClose}>
            Hủy
          </Button>

          <Button variant="contained" color="primary" type="submit">
            Tạo
          </Button>
        </Box>
      </form>
    </Box>
  );
};
export default CreateTaskModal;
