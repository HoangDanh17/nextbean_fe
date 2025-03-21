import http from "@/lib/http";
import {
  CreateInternResType,
  CreateInternType,
  InternByIdResType,
  InternFilterType,
  InternListResType,
  InternSkillType,
  UpdateInternResType,
  UpdateInternType,
} from "@/schemaValidations/intern.schema";

const internApiRequest = {
  getListIntern: (page: number, psize: number, body: InternFilterType | null) =>
    http.get<InternListResType>(
      `/api/v1/interns?page=${page}&psize=${psize}${
        body?.["user-name"] ? `&username=${body["user-name"]}` : ""
      }${body?.email ? `&email=${body.email}` : ""}${
        body?.["student-code"] ? `&student-code=${body["student-code"]}` : ""
      }${
        body?.["ojt-semester"] ? `&ojt-semester=${body["ojt-semester"]}` : ""
      }${body?.gender ? `&gender=${body.gender}` : ""}${
        body?.address ? `&username=${body.address}` : ""
      }`
    ),
  getListInternById: (id: string) =>
    http.get<InternByIdResType>(`/api/v1/interns/${id}`),
  createIntern: (body: CreateInternType) =>
    http.post<CreateInternResType>("/api/v1/interns", body),
  updateIntern: (id: string | undefined, body: UpdateInternType) => {
    return http.put<UpdateInternResType>(`/api/v1/interns/${id}`, body);
  },
  updateInternSkill: (id: string | undefined, body: InternSkillType) => {
    return http.post<UpdateInternResType>(`/api/v1/interns/${id}/skill`, body);
  },
  deleteIntern: (body: string) =>
    http.delete<CreateInternResType>(`/api/v1/ojts/${body}`),
};

export default internApiRequest;
