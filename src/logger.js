// src/logger.js
import pino from "pino";
import { IS_PROD } from "./env.js";

const options = IS_PROD
  ? { level: "info", base: null } // avoids adding pid/hostname in structured output if desired
  : { level: "debug" };

export const logger = pino(options);
