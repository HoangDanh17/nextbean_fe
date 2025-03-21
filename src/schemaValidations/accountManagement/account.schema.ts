import z from "zod";

// Define the individual account schema
export const AccountSchema = z.object({
  id: z.string(),
  "user-name": z.string(),
  email: z.string(),
  role: z.string(),
  "created-at": z.string(),
});

// Define the pagination schema
export const AccountPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the filter schema
export const AccountFilterSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  "order-by": z.string().optional(),
  "created-at-from": z.string().optional(),
  "created-at-to": z.string().optional(),
});

// Define the full response schema
export const AccountListRes = z.object({
  paging: AccountPageSchema,
  filter: AccountFilterSchema,
  data: z.array(AccountSchema),
  status: z.number(),
});

export const CreateAccount = z.object({
  email: z.string(),
  password: z.string(),
  role: z.string(),
  "user-name": z.string()
});

export const AccountRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const UpdateAccount = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  "user-name": z.string()
});


export type AccountListResType = z.TypeOf<typeof AccountListRes>;
export type AccountFilterType = z.TypeOf<typeof AccountFilterSchema>;
export type AccountResType = z.TypeOf<typeof AccountRes>;
export type CreateAccountType = z.TypeOf<typeof CreateAccount>;
export type AccountType = z.TypeOf<typeof AccountSchema>;
export type UpdateAccountType = z.TypeOf<typeof UpdateAccount>;
