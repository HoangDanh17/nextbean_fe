import http from "@/lib/http";
import {
    AccountResType,
    CreateAccountType,
    UpdateAccountType,
    AccountListResType,
    AccountFilterType,
} from "@/schemaValidations/accountManagement/account.schema";

import { ListTaskFilterType, ListTaskAllResType, CreateTaskType, ListTaskResType, UpdateTaskType } from "@/schemaValidations/listTask/listTask.schema";
import { ProjectMemberListResType } from "@/schemaValidations/projectMember/projectMember.schema";
const listTaskApiRequest = {

    getListTask: (id: string | undefined, page: number, psize: number, body: ListTaskFilterType | null) =>
        http.get<ListTaskAllResType>(
            `/api/v1/projects/${id}/tasks?page=${page}&psize=${psize}
            ${body?.["assignee-code"] ? `&assignee-code=${body["assignee-code"]}` : ""}
            ${body?.["assignee-name"] ? `&assignee-name=${body["assignee-name"]}` : ""}
            ${body?.["is-approved"] ? `&is-approved=${body["is-approved"]}` : ""}
            ${body?.name ? `&name=${body?.name}` : ""}
            ${body?.status ? `&status=${body?.status}` : ""}           
            `
        ),

    getMemberInProject: (id: string | undefined) => 
        http.get<ProjectMemberListResType>(
            `/api/v1/projects/${id}/member-in-project`
        ),

    // Đang gán cứng id
    createTask: (id: string | undefined, body: CreateTaskType) =>
        http.post<ListTaskResType>(`/api/v1/projects/${id}/tasks`, body),

    updateTask: (id: string | undefined, body: UpdateTaskType) => {
        const { taskId, ...updateBody } = body;
        return http.put<ListTaskResType>(
            `/api/v1/projects/${id}/tasks/${body.taskId}`,
            updateBody
        );
    },

};
export default listTaskApiRequest;