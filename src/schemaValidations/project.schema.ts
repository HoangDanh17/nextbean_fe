import z from "zod";

// Define the individual project schema
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  "est-start-time": z.string(),
  "est-completion-time": z.string(),
});

// Define the pagination schema
export const ProjectPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the filter schema
export const ProjectFilterSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  "est-start-time-from": z
    .union([z.string().nullable(), z.date().nullable()])
    .optional(),
  "est-start-time-to": z
    .union([z.string().nullable(), z.date().nullable()])
    .optional(),
});

// Define the full response schema
export const ProjectListRes = z.object({
  paging: ProjectPageSchema,
  filter: ProjectFilterSchema,
  data: z.array(ProjectSchema),
  status: z.number(),
});

export const CreateProject = z.object({
  description: z.string(),
  name: z.string(),
  "est-start-time": z.union([z.string().nullable(), z.date().nullable()]),
  "est-completion-time": z.union([z.string().nullable(), z.date().nullable()]),
});

export const UpdateProject = z.object({
  id: z.string(),
  description: z.string(),
  "est-completion-time": z.union([z.string().nullable(), z.date().nullable()]),
  "est-start-time": z.union([z.string().nullable(), z.date().nullable()]),
  name: z.string(),
  status: z.string(),
});

export const UpdateProjectForApi = z.object({
  id: z.string(),
  description: z.string(),
  "est-completion-time": z.union([z.string().nullable(), z.date().nullable()]),
  "est-start-time": z.union([z.string().nullable(), z.date().nullable()]),
  name: z.string(),
  status: z.string(),
});

export const CreateProjectRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const MemberInProject = z.object({
  id: z.string(),
  "user-name": z.string(),
  email: z.string(),
});

export const MemberInProjectRes = z.object({
  status: z.number(),
  data: z.array(MemberInProject),
});

export const DetailProject = z.object({
  id: z.string(),
  name: z.string(),
  status:z.string(),
  description:z.string(),
  "est-start-time":z.string(),
  "est-completion-time":z.string(),
  "total-member":z.number(),
  "total-task":z.number(),
  "total-task-conpleted": z.number(),
});

export const DetailProjectRes = z.object({
  status: z.number(),
  data: DetailProject,
});

export type ProjectListResType = z.TypeOf<typeof ProjectListRes>;
export type ProjectType = z.TypeOf<typeof ProjectSchema>;
export type ProjectFilterType = z.TypeOf<typeof ProjectFilterSchema>;

export type CreateProjectResType = z.TypeOf<typeof CreateProjectRes>;
export type CreateProjectType = z.TypeOf<typeof CreateProject>;

export type UpdateProjectType = z.TypeOf<typeof UpdateProject>;
export type UpdateProjectApiType = z.TypeOf<typeof UpdateProjectForApi>;

export type MemberInProjectResType = z.TypeOf<typeof MemberInProjectRes>;
export type MemberInProjectType = z.TypeOf<typeof MemberInProject>;

export type DetailProjectResType = z.TypeOf<typeof DetailProjectRes>;
export type DetailProjectType = z.TypeOf<typeof DetailProject>;
