'use client'
import React, { useState } from 'react';
import ProjectMemberPM from '@/components/projectMember/FilterPM';
import { useAppContext } from "@/app/app-provider";

const ProjectMembersPage = (props: any) => {
   
    const [loading, setLoading] = useState(false);

    const { project } = useAppContext()
    console.log("project: ", project);

    return (
        <div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <ProjectMemberPM selectedProjectId={project?.id} />

            )}

        </div>
    );
};

export default ProjectMembersPage;