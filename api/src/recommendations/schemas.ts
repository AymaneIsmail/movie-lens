import { z } from "zod";

export const PaginationRequestSchema = z.object({
  pagesize: z.coerce.number().default(25),
  pagestate: z.string().optional(),
});

export const RecommendationsRequestSchema = PaginationRequestSchema.extend({
  userid: z.coerce.number().optional(),
  movieid: z.coerce.number().optional(),
  minscore: z.coerce.number().optional(),
});
