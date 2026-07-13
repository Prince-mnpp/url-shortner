import express from "express";

// 1. CATCH SILENT CRASHES IMMEDIATELY
process.on("uncaughtException", (err) => {
  console.error("💥 CRITICAL UNCAUGHT ERROR:", err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 UNHANDLED PROMISE REJECTION:", reason);
});

import { shortenerRoutes } from "./routes/shortener.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(shortenerRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});