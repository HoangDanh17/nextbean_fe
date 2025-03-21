"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CardHeader,
  Skeleton,
} from "@mui/material";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import authApiRequest from "@/apiRequests/auth";
import { toast } from "@/components/ui/use-toast";
import { useAppContext } from "@/app/app-provider";
import projectApiRequest from "@/apiRequests/project";
import {
  ProjectListResType,
  ProjectType,
} from "@/schemaValidations/project.schema";
import dayjs from "dayjs";

const ListCardLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setProject } = useAppContext();
  const [limit, setLimit] = useState(12);
  const handleLoadMore = () => setLimit(limit + 12);
  const [listProject, setListProject] = useState<ProjectListResType>();
  const [loading, setLoading] = useState(false);

  const handleCardClick = (project: ProjectType) => {
    setProject(project);
    router.push("/homePage");
  };

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        toast({
          title: `Đăng xuất thành công`,
          duration: 2000,
          variant: "info",
        });
        router.push(`/login?redirectFrom=${pathname}`);
      });
    } finally {
      setUser(null);
      router.refresh();
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { payload } = await projectApiRequest.getListProject(1, limit, {});
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
    <div className="bg-gray-200 h-screen w-full">
      <div
        className="w-full text-center bg-slate-100 shadow-lg"
        style={{
          padding: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1, textAlign: "center", marginLeft: 100 }}>
          <Typography variant="h6" style={{ fontWeight: 800 }}>
            NEXTBEAN CENTER
          </Typography>
        </div>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="primary"
          startIcon={<LogoutIcon />}
          style={{ marginRight: 20 }}
        >
          Logout
        </Button>
      </div>
      <div className="w-full p-5">
        <Typography variant="h5" style={{ marginTop: 20, marginBottom: 20 }}>
          Danh sách các dự án
        </Typography>
        <ScrollArea className="h-[550px] rounded-md border p-2 mr-3">
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
                    onClick={() => handleCardClick(project)}
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
                      <Typography variant="h6">{project.name}</Typography>
                      <Typography color="textSecondary">
                        {dayjs(project["est-start-time"]).format("DD/MM/YYYY")}
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

export default ListCardLayout;
