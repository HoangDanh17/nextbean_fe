"use client";
import termApiRequest from "@/apiRequests/term";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TermListResType } from "@/schemaValidations/term.schema";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ListTerm = () => {
  const [listProject, setListProject] = useState<TermListResType>();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(12);
  const handleLoadMore = () => setLimit(limit + 12);
  const router = useRouter();
  const path = usePathname();
  const handleCardClick = (name: string, id: string) => {
    router.push(`${path}/name=${name}&id=${id}`);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await termApiRequest.getListTerm(1, limit, null);
        setListProject(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  return (
    <div>
      <div className="w-full">
        <Typography variant="h5" style={{ marginTop: 20, marginBottom: 20 }}>
          Danh sách các kỳ
        </Typography>
        <ScrollArea className="h-[450px] rounded-md  p-2 mr-3">
          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(9)).map((_, index) => (
                  <Card key={index} className="w-[360px]">
                    <CardHeader>
                      <Skeleton variant="text" width="80%" height={30} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                      />
                    </CardHeader>
                  </Card>
                ))
              : listProject?.data.map((project, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      onClick={() =>
                        handleCardClick(project.semester, project.id)
                      }
                      className="hover:scale-105 transition-transform duration-400 ease-in-out cursor-pointer shadow-2xl rounded-2xl"
                    >
                      <CardContent
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          height: "150px",
                        }}
                      >
                        <Typography variant="h6">{project.semester}</Typography>
                        <Typography color="textSecondary">
                          {dayjs(project["start-at"]).format("DD/MM/YYYY")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
          {listProject?.data?.length && listProject.data.length > 12 && (
            <div className="flex justify-center">
              <Button onClick={handleLoadMore} style={{ marginTop: 16 }}>
                Load More
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ListTerm;
