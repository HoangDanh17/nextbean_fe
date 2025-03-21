import z from "zod";

export const dashboardSchema = z.object({
  id: z.string(),
  semester: z.string(),
  university: z.string(),
  status: z.string(),
  "total-intern": z.string(),
});

export const dashboardListRes = z.object({
  data: z.array(dashboardSchema),
  status: z.number(),
});

export const dashboardTotalSchema = z.object({
  "total-project-in-progress": z.number(),
  "total-intern-in-progress": z.number(),
});

export const dashboardListTotalRes = z.object({
  data: dashboardTotalSchema,
  status: z.number(),
});

export type dashboardSchemaType = z.TypeOf<typeof dashboardSchema>;
export type dashboardListResType = z.TypeOf<typeof dashboardListRes>;

export type dashboardTotalSchemaType = z.TypeOf<typeof dashboardTotalSchema>;
export type dashboardListTotalResType = z.TypeOf<typeof dashboardListTotalRes>;
