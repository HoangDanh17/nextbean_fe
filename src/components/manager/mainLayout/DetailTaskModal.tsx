"use client";
import React, {
  useState,
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {
  Divider,
  Chip,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskType } from "@/schemaValidations/task.schema";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import commentApiRequest from "@/apiRequests/comment";
import { CommentListResType } from "@/schemaValidations/comment.schema";
import { toast } from "@/components/ui/use-toast";
import { Task } from "@/components/projectManager/ListTable";
import { ListTaskType } from "@/schemaValidations/listTask/listTask.schema";

const DetailTaskModal = ({ selectedRow }: { selectedRow: TaskType |ListTaskType }) => {
  const [comment, setComment] = useState("");

  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [loadMore, setLoadMore] = useState(false);
  const handleLoadMore = () => {
    setLimit(limit + 10);
    setLoadMore(true);
  };
  const [data, setData] = useState<CommentListResType>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await commentApiRequest.getListComment(
          selectedRow.id,
          1,
          limit,
          selectedType
        );
        setData(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit, selectedType, refreshKey]);

  const handleCommentChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    const body = {
      content: comment,
      type: "comment",
    };
    commentApiRequest
      .createComment(selectedRow.id, body)
      .then(() => {
        setRefreshKey((prevKey) => prevKey + 1);
        setComment("");
      })
      .catch((error) => {
        toast({
          title: `${error}`,
          duration: 2000,
          variant: "destructive",
        });
      });
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "todo":
        return { backgroundColor: "#FFB6C1", color: "white" };
      case "in_progress":
        return { backgroundColor: "#87CEEB", color: "white" };
      case "completed":
        return { backgroundColor: "#90EE90", color: "white" };
      case "cancel":
        return { backgroundColor: "#FFA07A", color: "white" };
      default:
        return { backgroundColor: "#D3D3D3", color: "white" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
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

  const formatDateTime = (timestamp: string) => {
    return dayjs(timestamp).format("DD/MM/YYYY HH:mm");
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadMore === true) {
      setLoadMore(false);
    } else {
      if (data && scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [refreshKey]);

  return (
    <Box display="flex" flexDirection="row" flex={1}>
      <Box flex={25} mr={2} maxHeight="500px">
        <Typography variant="h6" color="primary">
          Thông tin công việc
        </Typography>
        <Box mb={2}>
          <Stack spacing={2} className="mt-6">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" fontWeight="bold">
                Tên công việc:
              </Typography>
              <Tooltip title={selectedRow.name} arrow>
                <Typography
                  variant="body1"
                  noWrap
                  style={{ maxWidth: "150px" }}
                >
                  {selectedRow.name}
                </Typography>
              </Tooltip>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" fontWeight="bold">
                Người được phân công:
              </Typography>
              <Typography variant="body1">
                {selectedRow["assigned-name"]}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" fontWeight="bold">
                Thời gian (act):
              </Typography>
              <Typography variant="body1">
                {selectedRow["actual-effort"]} giờ
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" fontWeight="bold">
                Thời gian (est):
              </Typography>
              <Typography variant="body1">
                {selectedRow["estimated-effort"]} giờ
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box mb={2}>
          <Stack spacing={2} className="mt-4">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" fontWeight="bold">
                Trạng thái xác nhận:
              </Typography>
              <Typography display="flex" alignItems="center">
                <Typography variant="body1">
                  {selectedRow["is-approved"] ? "Đã xác nhận" : "Chưa xác nhận"}
                </Typography>
                {selectedRow["is-approved"] ? (
                  <DoneAllIcon sx={{ color: "#00FF00", ml: 1 }} />
                ) : (
                  <CloseIcon sx={{ color: "#FF0000", ml: 1 }} />
                )}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" fontWeight="bold" className="mt-2">
                Trạng thái công việc:
              </Typography>
              <Typography variant="body1">
                <Chip
                  label={getStatusLabel(selectedRow.status)}
                  style={{
                    ...getStatusChipColor(selectedRow.status),
                    fontWeight: "bold",
                  }}
                />
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1" fontWeight="bold">
                Mô tả task:
              </Typography>
              <ScrollArea className="h-[210px] pr-2">
                <Typography
                  variant="body1"
                  style={{
                    maxWidth: "1200px",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                  }}
                >
                  {selectedRow.description}
                </Typography>
              </ScrollArea>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box flex={70} ml={2} maxHeight="500px">
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex">
            <Typography variant="h6" color="primary">
              Chi tiết báo cáo -
            </Typography>
            <Box display="flex" style={{ height: 20 }}>
              <Typography variant="body1" className="mx-4">
                Chọn loại:
              </Typography>
              <FormControl sx={{ minWidth: 200, mb: 2, mr: 2 }}>
                <Select
                  labelId="term-select-label"
                  value={selectedType}
                  label="Select Term"
                  variant="standard"
                  placeholder="Chọn loại"
                  size="small"
                  defaultValue=""
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="comment">comment</MenuItem>
                  <MenuItem value="report">report</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <ScrollArea
            ref={scrollAreaRef}
            style={{
              height: "400px",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              scrollBehavior: "smooth",
            }}
          >
            <Stack
              spacing={2}
              paddingRight={2}
              paddingBottom={2}
              style={{ display: "flex", flexDirection: "column-reverse" }}
            >
              {data?.data.slice(0, limit).map((item, index) => (
                <React.Fragment key={index}>
                  {item.type === "report" ? (
                    <Box key={index} display="flex" width="100%">
                      <Box
                        bgcolor="#FDCF76"
                        color="white"
                        p={2}
                        borderRadius={2}
                        mb={1}
                        minHeight="80px"
                        maxWidth="70%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="textPrimary"
                        >
                          {item["user-name"]}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{
                            maxWidth: "100%",
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.content}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Report - {formatDateTime(item["created-at"])}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent={
                        item["is-owner"] === true ? "flex-end" : "flex-start"
                      }
                      width="100%"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection={
                          item["is-owner"] === true ? "row-reverse" : "row"
                        }
                        bgcolor={
                          item["is-owner"] === true ? "#e0f7fa" : "#f5f5f5"
                        }
                        p={2}
                        borderRadius={2}
                        mb={1}
                        maxWidth="70%"
                      >
                        <Avatar src={item.avatar} alt={item["user-name"]} />
                        <Box
                          ml={item["is-owner"] === true ? 0 : 2}
                          mr={item["is-owner"] === true ? 2 : 0}
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems={
                              item["is-owner"] === true
                                ? "flex-end"
                                : "flex-start"
                            }
                          >
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="textPrimary"
                            >
                              {item["user-name"]}
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{
                                maxWidth: "100%",
                                wordBreak: "break-all",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {item.content}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Comment - {formatDateTime(item["created-at"])}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </React.Fragment>
              ))}
              <Button
                onClick={handleLoadMore}
                style={{
                  display: data && data?.paging?.items <= limit ? "none" : "",
                }}
              >
                Load More
              </Button>
            </Stack>
          </ScrollArea>
        </Box>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          gap={2}
          style={{
            marginTop: "auto",
          }}
        >
          <TextField
            label="Nhập bình luận"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={handleCommentChange}
            style={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            style={{
              flexShrink: 0,
              marginLeft: "10px",
              alignSelf: "flex-end",
            }}
            disabled={comment.trim() === ""}
          >
            Gửi
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailTaskModal;
