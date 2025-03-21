import z from "zod";

export const TimeTableSchema = z.object({
  id: z.string(),
  intern_name: z.string(),
  "student-code": z.string(),
  "office-time": z.string(),
  verified: z.string(),
  "est-start-time": z.string(),
  "est-end-time": z.string(),
  "act-clockin": z.string(),
  "clockin-validated": z.string(),
  "act-clockout": z.string(),
  "clockout-validated": z.string(),
  "status-attendance": z.string(),
});

export const TimeTablePageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

export const TimeTableFilterSchema = z.object({
  verified: z.string().optional(),
  "intern-name": z.string().optional(),
  "office-time-from": z.string().optional(),
  "office-time-to": z.string().optional(),
});

export const TimeTableRes = z.object({
  paging: TimeTablePageSchema,
  filter: TimeTableFilterSchema,
  data: z.array(TimeTableSchema),
  status: z.number(),
});

export const CreateRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const WeekSchema = z.object({
  "week-day": z.string(),
  date: z.union([z.string().nullable(), z.date().nullable()]),
  "total-approved": z.number(),
  "total-denied": z.number(),
  "total-waiting": z.number(),
});

export const WeekRes = z.object({
  status: z.number(),
  data: z.array(WeekSchema),
});

export type TimeTableResType = z.TypeOf<typeof TimeTableRes>;
export type CreateResType = z.TypeOf<typeof CreateRes>;
export type TimeTableType = z.TypeOf<typeof TimeTableSchema>;
export type TimeTableFilterType = z.TypeOf<typeof TimeTableFilterSchema>;
export type WeekType = z.TypeOf<typeof WeekSchema>;
export type WeekResType = z.TypeOf<typeof WeekRes>;
