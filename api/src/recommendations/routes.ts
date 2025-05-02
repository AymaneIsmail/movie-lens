import { Router } from "express";
import { getRecommendations } from "@/recommendations/service.js";
import { GetRecommendationsRequestSchema } from "@/recommendations/schemas.js";

export function recommendationRouter() {
  const router = Router();

  router.get("/", async (req, res, next) => {
    const recommendationReq = GetRecommendationsRequestSchema.safeParse(
      req.query
    );

    if (!recommendationReq.success) {
      res.status(400).json({
        error: "Invalid query parameters",
        details: recommendationReq.error.format(),
      });

      return next();
    }

    console.log(recommendationReq.data)

    try {
      const recommendations = await getRecommendations(recommendationReq.data);
      res.status(200).json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An error occurred while fetching recommendations.",
      });
    }
  });

  return router;
}
