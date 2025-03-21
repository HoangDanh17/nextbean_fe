import z from "zod";

// Define the individual account schema
export const ListTaskSchema = z.object({
  id: z.string(),
  "project-id": z.string(),
  "assigned-to": z.string(),
  "assigned-name": z.string(),
  "assigned-code": z.string(),
  "is-approved": z.string(),
  status: z.string(),
  name: z.string(),
  description: z.string(),
  "estimated-effort": z.number(),
  "actual-effort": z.string(),
});

// Define the pagination schema
export const ListTaskPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the filter schema
export const ListTaskFilterSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  "assignee-name": z.string().optional(),
  "assignee-code": z.string().optional(),
  "is-approved": z.string().optional(),
});

// Define the full response schema
export const ListTaskResAll = z.object({
  paging: ListTaskPageSchema,
  filter: ListTaskFilterSchema,
  data: z.array(ListTaskSchema),
  status: z.number(),
});

export const CreateTask = z.object({
  "assigned-to": z.string(),
  name: z.string(),
  description: z.string(),
  "estimated-effort": z.number(),
});

export const ListTaskRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const UpdateTask = z.object({
  taskId: z.string(),
  "assigned-to": z.string(),
  name: z.string(),
  description: z.string(),
  "estimated-effort": z.number(),
  "is-approved": z.union([z.string(), z.boolean(),z.undefined()]),
});

export type ListTaskAllResType = z.TypeOf<typeof ListTaskResAll>;
export type ListTaskFilterType = z.TypeOf<typeof ListTaskFilterSchema>;
export type ListTaskResType = z.TypeOf<typeof ListTaskRes>;

export type CreateTaskType = z.TypeOf<typeof CreateTask>;
export type ListTaskType = z.TypeOf<typeof ListTaskSchema>;
export type UpdateTaskType = z.TypeOf<typeof UpdateTask>;
