import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs, { Dayjs } from "dayjs";
import timetableApiRequest from "@/apiRequests/timetable";
import { TimeTableResType } from "@/schemaValidations/timetable.schema";
import { toast } from "@/components/ui/use-toast";
import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";

const ListTimeTable = ({
  status,
  selectedDay,
}: {
  status: string;
  selectedDay: Dayjs | null | undefined;
}) => {
  const [dataModal, setDataModal] = useState<TimeTableResType | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = {
          verified: status === "all" ? "" : status,
          "office-time-from": dayjs(selectedDay).format("YYYY-MM-DD"),
          "office-time-to": dayjs(selectedDay).format("YYYY-MM-DD"),
        };
        const { payload } = await timetableApiRequest.getTimeTable(body);
        setDataModal(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [status, selectedDay, refreshKey]);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(id: string, newStatus: string) {
    setLoading(true);

    const body = { verified: newStatus };
    try {
      const result = await timetableApiRequest.approveTimeTable(id, body);
      toast({
        title: `${result.payload.message}`,
        duration: 2000,
        variant: "success",
      });
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error: any) {
      toast({
        title: `${error}`,
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollArea className="h-[370px] scale-15 shadow-2xl p-4 rounded-lg border">
      <List style={{ width: "1000px" }}>
        {dataModal?.data.length ? (
          dataModal.data.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                    >
                      <div className="flex flex-col">
                        <Typography component="span" variant="body1">
                          Tên thực tập:
                          <Typography
                            component="span"
                            variant="body1"
                            style={{ fontWeight: "bold" }}
                          >
                            {item.intern_name} - {item["student-code"]}
                          </Typography>
                        </Typography>
                        <Typography component="span">
                          Thời gian:
                          <Typography
                            component="span"
                            variant="body1"
                            style={{ fontWeight: "bold" }}
                          >
                            {item["est-start-time"]} - {item["est-end-time"]}
                          </Typography>
                        </Typography>
                      </div>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        width="50%"
                      >
                        <Typography
                          component="span"
                          style={{
                            marginLeft: 16,
                          }}
                        >
                          Status:{" "}
                          {item.verified === "processing" ? (
                            <Typography
                              component="span"
                              style={{ color: "#bab8b5" }}
                            >
                              Đang đợi
                            </Typography>
                          ) : item.verified === "approved" ? (
                            <Typography
                              component="span"
                              style={{ color: "green" }}
                            >
                              Đã duyệt
                            </Typography>
                          ) : (
                            <Typography
                              component="span"
                              style={{ color: "red" }}
                            >
                              Từ chối
                            </Typography>
                          )}
                        </Typography>
                        <Box ml={2} display="flex" alignItems="center">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleSubmit(item.id, "approved")}
                            disabled={loading}
                            style={{ marginRight: 8 }}
                          >
                            Duyệt đơn
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DoNotDisturbOnIcon />}
                            onClick={() => handleSubmit(item.id, "denied")}
                            disabled={loading}
                          >
                            Từ chối
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < dataModal.data.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography component="span" variant="h5" className="mt-20">
              Chưa có lịch thực tập ngày hôm nay
            </Typography>
          </Box>
        )}
      </List>
    </ScrollArea>
  );
};

export default ListTimeTable;
