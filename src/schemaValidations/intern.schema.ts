import z from "zod";

// Define the individual project schema
export const InternSchema = z.object({
  "account-id": z.string(),
  "intern-id": z.string(),
  "user-name": z.string(),
  email: z.string(),
  "student-code": z.string(),
  avatar: z.string(),
  gender: z.string(),
  "date-of-birth": z.string(),
  "phone-number": z.string(),
  address: z.string(),
  "ojt-semester": z.string(),
});

export const InternPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the filter schema
export const InternFilterSchema = z.object({
  "user-name": z.string().optional(),
  email: z.string().optional(),
  "student-code": z.string().optional(),
  "ojt-semester": z.string().optional(),
  gender: z.string().optional(),
  "phone-number": z.string().optional(),
  address: z.string().optional(),
});

export const InternListRes = z.object({
  paging: InternPageSchema,
  filter: InternFilterSchema,
  data: z.array(InternSchema),
  status: z.number(),
});

export const CreateIntern = z.object({
  "user-name": z.string(),
  email: z.string(),
  "student-code": z.string(),
  avatar: z.string(),
  gender: z.string(),
  "date-of-birth": z.string(),
  "phone-number": z.string(),
  address: z.string(),
  "ojt-id": z.number(),
  password: z.string(),
});

export const CreateInternRes = z.object({
  status: z.number(),
  message: z.string(),
  log: z.string(),
});

export const UpdateIntern = z.object({
  address: z.string(),
  avatar: z.string(),
  "date-of-birth": z.string(),
  email: z.string(),
  gender: z.string(),
  "ojt-id": z.number().optional(),
  "phone-number": z.string(),
  "student-code": z.string(),
  "user-name": z.string(),
});

export const UpdateInternRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const InternSkillSchema = z.object({
  "technical-skill": z.string(),
  "skill-level": z.string(),
});

export const InternByIdSchema = z.object({
  id: z.string(),
  "user-name": z.string(),
  email: z.string(),
  "student-code": z.string(),
  avatar: z.string(),
  gender: z.string(),
  "date-of-birth": z.string(),
  "phone-number": z.string(),
  address: z.string(),
  "detail-skill": z.array(InternSkillSchema),
  "ojt-id": z.number(),
});

export const InternByIdRes = z.object({
  status: z.number(),
  data: InternByIdSchema,
});

export const InternSkill = z.object({
  "skill-level": z.array(z.string()), // Chỉ định rõ kiểu dữ liệu của mảng skill-level là mảng các string
  skills: z.array(z.string().nullable()), // Chỉ định rõ kiểu dữ liệu của mảng skills là mảng các string
});

export type InternSchemaType = z.TypeOf<typeof InternSchema>;
export type InternSkillType = z.TypeOf<typeof InternSkill>;
export type InternListResType = z.TypeOf<typeof InternListRes>;
export type InternFilterType = z.TypeOf<typeof InternFilterSchema>;
export type CreateInternResType = z.TypeOf<typeof CreateInternRes>;
export type CreateInternType = z.TypeOf<typeof CreateIntern>;
export type UpdateInternResType = z.TypeOf<typeof UpdateInternRes>;
export type UpdateInternType = z.TypeOf<typeof UpdateIntern>;

export type InternByIdSchemaType = z.TypeOf<typeof InternByIdSchema>;
export type InternSkillSchemaType = z.TypeOf<typeof InternSkillSchema>;
export type InternByIdResType = z.TypeOf<typeof InternByIdRes>;
