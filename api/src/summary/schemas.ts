import { z } from "zod";

export const SummaryRequestSchema = z.object({
  minscore: z.coerce.number().optional().default(0),
  userId: z.string().optional(),
  genres: z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(z.string()).optional().default([])
  ),
});
