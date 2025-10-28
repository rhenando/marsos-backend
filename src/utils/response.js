// src/utils/response.js

export function ok(res, status = 200, message = "Success", data = null) {
  // If the response is an array, send it directly for frontends like admin dashboards
  if (Array.isArray(data)) {
    return res.status(status).json(data);
  }
  return res.status(status).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
  });
}

export function fail(res, status = 400, message = "Error", details = null) {
  return res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
