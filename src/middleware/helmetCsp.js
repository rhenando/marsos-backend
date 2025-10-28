// src/middleware/helmetCsp.js
import helmet from "helmet";
import { ENV } from "../env.js";

export default function helmetMiddleware() {
  const allowedOrigins =
    ENV.ALLOWED_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];

  // base helmet
  const h = helmet({
    contentSecurityPolicy: false, // we'll configure CSP below
    crossOriginEmbedderPolicy: false,
  });

  const cspDirectives = {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", ...allowedOrigins],
    imgSrc: ["'self'", "data:"],
    styleSrc: ["'self'", "'unsafe-inline'"], // remove 'unsafe-inline' in prod if possible
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
  };

  return [
    h,
    helmet.contentSecurityPolicy({
      directives: cspDirectives,
    }),
    // additional headers
    helmet.frameguard({ action: "deny" }),
    helmet.hidePoweredBy(),
    helmet.hsts({ maxAge: 31536000, includeSubDomains: true }),
    helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }),
  ];
}
