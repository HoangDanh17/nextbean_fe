import http from "@/lib/http";
import {
  CommentListResType,
  CreateCommentResType,
  CreateCommentType,
} from "@/schemaValidations/comment.schema";

const commentApiRequest = {
  getListComment: (
    id: string,
    page: number,
    psize: number,
    selectedType: string | null
  ) =>
    http.get<CommentListResType>(
      `/api/v1/tasks/${id}/comments?page=${page}&psize=${psize}${
        selectedType !== "all" ? `&type=${selectedType}` : ""
      }`
    ),
  createComment: (id: string, body: CreateCommentType) =>
    http.post<CreateCommentResType>(`/api/v1/tasks/${id}/comments`, body),
};

export default commentApiRequest;
