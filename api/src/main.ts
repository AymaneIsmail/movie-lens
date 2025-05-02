import { startServer } from "@/server.js";

startServer().catch((error) => {
  console.error("❌ Error starting server:", error);
  process.exit(1);
});
