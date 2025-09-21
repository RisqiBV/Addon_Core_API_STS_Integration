import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { getPool } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Simple routes
app.get("/health", (req, res) => {
  const data = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
  res.json(data);
});

app.get("/api/v1/greet", (req, res) => {
  const name = (req.query.name || "there").toString();
  res.json({ message: `Hello, ${name}! 👋` });
});

app.get("/api/v1/customers", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT TOP 10 * FROM Customer_Master");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Swagger docs
const swaggerDocument = YAML.load(path.join(__dirname, "..", "openapi.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root
app.get("/", (req, res) => {
  res.type("text").send("API is running. Try /health or /docs");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
  console.log(`📘 Docs at http://localhost:${PORT}/docs`);
});