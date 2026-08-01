import { envConfig } from "./env.config.js";

export const corsConfig = {
  origin: (origin, callback) => {
    if (!origin || envConfig.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS Violation: Origin '${origin}' is not allowed.`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Disposition"],
  credentials: true,
  maxAge: 86400,
};