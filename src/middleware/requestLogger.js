// src/middleware/requestLogger.js
import pinoHttp from "pino-http";
import { logger } from "../logger.js";

export default pinoHttp({
  logger,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.headers['x-admin-internal-token']",
    "res.headers['set-cookie']",
  ],
});
