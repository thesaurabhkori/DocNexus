import request from "supertest";
import app from "../app.js";

describe("Core Infrastructure & Monitoring Endpoints", () => {
  describe("GET /", () => {
    it("should return HTTP 200 with engine online status", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("status", "online");
      expect(res.body).toHaveProperty("engine", "DocNexus Backend Engine");
    });
  });

  describe("GET /health", () => {
    it("should return system health and uptime metadata", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("status", "UP");
      expect(res.body.data.uptime).toHaveProperty("processSeconds");
    });
  });

  describe("GET /metrics", () => {
    it("should return process memory and CPU consumption metrics", async () => {
      const res = await request(app).get("/metrics");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("process");
      expect(res.body.data).toHaveProperty("memory");
      expect(res.body.data.memory).toHaveProperty("heapUsedMB");
    });
  });

  describe("Global 404 Route Interceptor", () => {
    it("should return HTTP 404 for unknown API endpoints", async () => {
      const res = await request(app).get("/api/non-existent-endpoint");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.message).toContain("API Route");
    });
  });
});