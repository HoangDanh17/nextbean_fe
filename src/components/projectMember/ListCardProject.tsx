'use client'
import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Card, CardContent, CardHeader, Skeleton } from '@mui/material';
import "@/styles/projectMember/Filter.css"
import projectApiRequest from '@/apiRequests/project';
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from '@/app/app-provider';

type Project = {
    id: string;
    name: string;
};

const ListCardProject = () => {
    const [project, setProject] = useState<Project[]>([]);
    const [limit, setLimit] = useState(12);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        setLoading(true);
        projectApiRequest.getProject()
            .then(({ payload }) => {
                setProject(payload.data);
            })
            .catch(error => {
                console.error("Failed to fetch projects", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCardClick = (id: string) => {
        router.push(`${path}/${id}`);
    };
    

    return (
        <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12}>
                <Typography variant="h5" style={{ marginTop: 20, marginBottom: 20 }}>
                    Danh sách các dự án
                </Typography>
                <Grid container spacing={3}>
                    {loading
                        ? Array.from(new Array(9)).map((_, index) => (
                            <Card key={index} className="w-[360px]">
                                <CardHeader>
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="rectangular" width="100%" height={60} />
                                </CardHeader>
                            </Card>
                        ))
                        : project.map((project, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    onClick={() => handleCardClick(project.id)}
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
                {project.length && project.length > 12 && (
                    <div className="flex justify-center">
                        <Button onClick={() => setLimit(limit + 12)} style={{ marginTop: 16 }}>
                            Load More
                        </Button>
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default ListCardProject;