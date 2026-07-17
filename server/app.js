import express from "express";
import dotenv from "dotenv";
import path from "path";
import imageToPdfRoute from "./routes/imageToPdf.route.js";

dotenv.config();

const app = express();

// ⚡ DEV TUNNELS & DYNAMIC IP CORS FORCE-BYPASS MIDDLEWARE
app.use((req, res, next) => {
  // "*" allow karne se mobile phone hotspot network aur badalte hue Dev Tunnel addresses dono chalenge
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Tunnel-Skip-Anti-Phishing-Page"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Agar request browser ki check (OPTIONS Preflight) hai, toh direct 200 return karo
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Converted PDFs aur static files access urls
app.use("/converted", express.static(path.join(process.cwd(), "converted")));

// Core API Routing Endpoints
app.use("/api/image-to-pdf", imageToPdfRoute);

app.get("/", (req, res) => {
  res.send("🚀 DocNexus Backend Running Perfectly");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});