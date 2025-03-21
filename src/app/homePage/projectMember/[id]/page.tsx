'use client'
import React, { useState } from 'react';
import FilterProjectMember from '@/components/projectMember/Filter';

const ProjectMembersPage = (props: any) => {
    const { params } = props;
    const id = params.id;
    const [loading, setLoading] = useState(false);

    return (
        <div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <FilterProjectMember selectedProjectId={id} />

            )}

        </div>
    );
};

export default ProjectMembersPage;