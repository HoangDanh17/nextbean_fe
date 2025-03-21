import http from "@/lib/http";
import {
  CreateProjectResType,
  CreateProjectType,
  DetailProjectResType,
  MemberInProjectResType,
  ProjectFilterType,
  ProjectListResType,
  UpdateProjectApiType,
} from "@/schemaValidations/project.schema";

const projectApiRequest = {
  getListPMInProject: (id: string) =>
    http.get<MemberInProjectResType>(`api/v1/projects/${id}/pm-in-project`),

  getListPMNotInProject: (id: string) =>
    http.get<MemberInProjectResType>(
      `/api/v1/projects/${id}/pm-outside-project`
    ),

  getListProject: (
    page: number,
    psize: number,
    body: ProjectFilterType | null
  ) =>
    http.get<ProjectListResType>(
      `/api/v1/projects?page=${page}&psize=${psize}${
        body?.name ? `&name=${body.name}` : ""
      }${body?.status ? `&status=${body.status}` : ""}${
        body?.["est-start-time-from"]
          ? `&est-start-time-from=${body?.["est-start-time-from"]}`
          : ""
      }${
        body?.["est-start-time-to"]
          ? `&est-start-time-to=${body?.["est-start-time-to"]}`
          : ""
      }`
    ),

  getDetailProject: (id: string|undefined) =>
    http.get<DetailProjectResType>(`api/v1/projects/${id}/detail`),

  createProject: (body: CreateProjectType) =>
    http.post<CreateProjectResType>("/api/v1/projects", body),

  addPmIntoProject: (id: string, body: { "list-manager-id": string[] }) =>
    http.post<CreateProjectResType>(
      `api/v1/projects/${id}/project-managers`,
      body
    ),

  updateProject: (body: UpdateProjectApiType) => {
    const { id, ...updateBody } = body;
    return http.put<CreateProjectResType>(
      `/api/v1/projects/${body.id}`,
      updateBody
    );
  },

  getProject: () => http.get<ProjectListResType>(`/api/v1/projects`),
};

export default projectApiRequest;
