import "./env.js";
import app from "./server/app.js";
import { ENV } from "./env.js";
import { logger } from "./logger.js";

if (process.env.VERCEL !== "1") {
  app.listen(ENV.PORT, () => {
    logger.info(`🚀 Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
  });
}

export default app;
