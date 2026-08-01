import express from "express";
import { getHealth, getMetrics } from "./health.controller.js";

const router = express.Router();

// GET /health - Lightweight heartbeat & uptime check
router.get("/health", getHealth);

// GET /metrics - Process & system memory/CPU diagnostic usage
router.get("/metrics", getMetrics);

export default router;