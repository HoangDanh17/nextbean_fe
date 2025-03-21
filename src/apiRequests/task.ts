import http from "@/lib/http";
import {
  TaskFilterType,
  TaskListResType,
} from "@/schemaValidations/task.schema";

const taskApiRequest = {
  getListTask: (
    id: string | undefined,
    page: number,
    psize: number,
    body: TaskFilterType | null
  ) =>
    http.get<TaskListResType>(
      `/api/v1/projects/${id}/tasks?page=${page}&psize=${psize}${
        body?.name ? `&name=${body.name}` : ""
      }${body?.status ? `&status=${body.status}` : ""}${
        body?.["assignee-name"]
          ? `&assignee-name=${body?.["assignee-name"]}`
          : ""
      }${
        body?.["assignee-code"]
          ? `&assignee-code=${body?.["assignee-code"]}`
          : ""
      }${body?.["is-approved"] ? `&is-approved=${body?.["is-approved"]}` : ""}`
    ),
};

export default taskApiRequest;
