import http from "@/lib/http";
import { ProjectMemberListResType, MemberNotInProFilterType, MemberNotInProListResType, ProjectMemberResType, MemberInProFilterType } from "@/schemaValidations/projectMember/projectMember.schema";

const projectMemberApiRequest = {
    getMemberInProject: (id: string, page: number, psize: number, body: MemberInProFilterType | null) =>
        http.get<ProjectMemberListResType>(
            `/api/v1/projects/${id}/member-in-project?page=${page}&psize=${psize}
            ${body?.["user-name"] ? `&user-name=${body["user-name"]}` : ""}
            ${body?.["student-code"] ? `&student-code=${body["student-code"]}` : ""}           
            ${body?.semester ? `&semester=${body.semester}` : ""}
            ${body?.university ? `&university=${body?.university}` : ""}
            ${body?.status ? `&status=${body.status}` : ""}
            `
        ),
    getMemberNotInProject: (id: string, psize: number, body: MemberNotInProFilterType | null) =>
        http.get<MemberNotInProListResType>(
            `/api/v1/projects/${id}/member-outside-project?page=1&psize=${psize}
            ${body?.["user-name"] ? `&user-name=${body["user-name"]}` : ""}
            ${body?.["student-code"] ? `&student-code=${body["student-code"]}` : ""}
            ${body?.semester ? `&semester=${body.semester}` : ""}
            ${body?.university ? `&university=${body?.university}` : ""}
            `
        ),

    addMemberIntoProject: (id: string | undefined, body: { "member-id": string }) =>
        http.post<ProjectMemberResType>(
            `api/v1/projects/${id}/member`,
            body
        ),

    deleteMemberInProject: (projectID: string | undefined, memberID: string) =>
        http.delete<ProjectMemberResType>(
            `/api/v1/projects/${projectID}/${memberID}`
        )
};
export default projectMemberApiRequest;