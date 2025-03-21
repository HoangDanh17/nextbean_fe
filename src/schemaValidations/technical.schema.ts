import { z } from "zod";

export const TechnicalSchema = z.object({
    id: z.string(),
    "Technical-skill": z.string(),
  });
  
  export const TechnicalPageSchema = z.object({
    page: z.number(),
    psize: z.number(),
    items: z.number(),
    pages: z.number(),
  });
  
  export const TechnicalFilterSchema = z.object({
    "id": z.number(),
    "Technical-skill": z.string(),
    "order-by": z.string()
  });
  
  export const TechnicalListRes = z.object({
    paging: TechnicalPageSchema,
    filter: TechnicalFilterSchema,
    data: z.array(TechnicalSchema),
    status: z.number(),
  });

  export type TechnicalListResType = z.TypeOf<typeof TechnicalListRes>;
export type TechnicalType = z.TypeOf<typeof TechnicalSchema>;
export type TechnicalFilterType = z.TypeOf<typeof TechnicalFilterSchema>;