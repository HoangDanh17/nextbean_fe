import z from "zod";

export const CommentSchema = z.object({
  id: z.string(),
  "user-name": z.string(),
  avatar: z.string().optional(),
  type: z.string(),
  content: z.string(),
  "created-at": z.string(),
  "is-owner": z.boolean(),
});

export const CommentPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the filter schema
export const CommentFilterSchema = z.object({
  type: z.string().optional(),
});

export const CommentListRes = z.object({
  paging: CommentPageSchema,
  filter: CommentFilterSchema,
  data: z.array(CommentSchema),
  status: z.number(),
});

export const CreateComment = z.object({
  content: z.string(),
  type: z.string(),
});

export const CreateCommentRes = z.object({
  status: z.number(),
  message: z.string(),
  log: z.string(),
});

export type CommentSchemaType = z.TypeOf<typeof CommentSchema>;
export type CommentListResType = z.TypeOf<typeof CommentListRes>;
export type CommentFilterSchemaType = z.TypeOf<typeof CommentFilterSchema>;

export type CreateCommentResType = z.TypeOf<typeof CreateCommentRes>;
export type CreateCommentType = z.TypeOf<typeof CreateComment>;
