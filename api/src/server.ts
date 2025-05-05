import express, { type Request, type Response } from "express";
import cors from "cors";
import { recommendationRouter } from "@/recommendations/routes.js";
import { env } from "@/env.js";
import { client } from "@/database.js";
import { summaryRouter } from "@/summary/routes.js";

function createExpressApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/recommendations", recommendationRouter());
  app.use("/summary", summaryRouter());

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the recommendations API!" });
  });

  app.use((req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: "The requested resource was not found.",
    });
  });

  app.use((err: unknown, req: Request, res: Response) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  });

  return app;
}

export async function startServer() {
  const app = createExpressApp();
  const port = env.PORT;

  try {
    await client.connect();
    console.log("✅ Connected to Cassandra");

    app.listen(port, () => {
      console.log(`🚀 API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Could not start API:", error);
    process.exit(1);
  }
}
