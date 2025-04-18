import { z } from "zod";

export const searchSchema = z.object({
  keywordSearch: z.string().optional(),
});

export type SearchDto = z.infer<typeof searchSchema>;
