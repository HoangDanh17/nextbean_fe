import z from "zod";

// Define the individual schema
export const TermSchema = z.object({
  id: z.string(),
  semester: z.string(),
  university: z.string(),
  "start-at": z.string(),
  "end-at": z.string(),
  status: z.string(),
});

export const TermPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the filter schema
export const TermFilterSchema = z.object({
  id: z.string().optional(),
  semester: z.string().optional(),
  university: z.string().optional(),
  status: z.string().optional(),
});

export const TermListRes = z.object({
  paging: TermPageSchema,
  filter: TermFilterSchema,
  data: z.array(TermSchema),
  status: z.number(),
});

export const CreateTerm = z.object({
  semester: z.string(),
  university: z.string(),
  "start-at": z.union([z.string().nullable(), z.date().nullable()]),
  "end-at": z.union([z.string().nullable(), z.date().nullable()]),
});

export const CreateTermRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const UpdateTerm = z.object({
  id: z.string(),
  semester: z.string(),
  university: z.string(),
  status: z.string(),
  "start-at": z.union([z.string().nullable(), z.date().nullable()]),
  "end-at": z.union([z.string().nullable(), z.date().nullable()]),
});

export const UpdateTermRes = z.object({
  status: z.number(),
  message: z.string(),
});

export type TermListResType = z.TypeOf<typeof TermListRes>;
export type TermFilterType = z.TypeOf<typeof TermFilterSchema>;
export type CreateTermResType = z.TypeOf<typeof CreateTermRes>;
export type CreateTermType = z.TypeOf<typeof CreateTerm>;
export type UpdateTermResType = z.TypeOf<typeof UpdateTermRes>;
export type UpdateTermType = z.TypeOf<typeof UpdateTerm>;
