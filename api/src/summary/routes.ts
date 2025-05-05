import { SummaryRequestSchema } from "@/summary/schemas.js";
import { getSummary } from "@/summary/service.js";
import { Router } from "express";

export function summaryRouter() {
  const router = Router();

  router.get("/", async (req, res, next) => {
    const recommendationReq = SummaryRequestSchema.safeParse(req.query);

    if (!recommendationReq.success) {
      res.status(400).json({
        error: "Invalid query parameters",
        details: recommendationReq.error.format(),
      });

      return next();
    }

    try {
      const summary = await getSummary(recommendationReq.data);
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An error occurred while fetching summary.",
      });
    }
  });

  return router;
}
