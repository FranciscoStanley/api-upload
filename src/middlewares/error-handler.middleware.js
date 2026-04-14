import { AppError } from "../errors/app-error.js";

export const errorHandler = (err, req, res, _next) => {
  if (err?.name === "MulterError") {
    res.status(400).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal server error";

  res.status(statusCode).json({
    error: {
      message,
      ...(isAppError && err.details ? { details: err.details } : {}),
    },
  });
};
