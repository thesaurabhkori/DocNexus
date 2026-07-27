import express from "express";
import dotenv from "dotenv";
import path from "path";
import toolRouter from "./routes/tools.route.js"; // 🚀 Master tools dynamic router

dotenv.config();

const app = express();

// ⚡ DEV TUNNELS & DYNAMIC IP CORS FORCE-BYPASS MIDDLEWARE
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Tunnel-Skip-Anti-Phishing-Page"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Converted PDFs aur static files access urls
app.use("/converted", express.static(path.join(process.cwd(), "converted")));

// 🔄 SAFE INTERNAL ENDPOINT REWRITER MIDDLEWARE
// Frontend ke paths (e.g. /api/word-to-pdf) ko completely safe state parameters me cleanly translate karega
app.use("/api/:action", (req, res, next) => {
  if (req.params.action) {
    const cleanAction = req.params.action.toLowerCase().replace(/[^a-z0-9]/g, "");
    // Strictly override the dynamic lookup route parameter block
    req.params.action = cleanAction;
  }
  next();
});

// 🔗 Centralized Master Tool Pipeline Endpoint
// Base URL path interceptor directly connects to tools dynamic layer
app.use("/api", toolRouter);

app.get("/", (req, res) => {
  res.send("🚀 DocNexus Backend Running Perfectly");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});