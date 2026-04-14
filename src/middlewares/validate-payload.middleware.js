import { AppError } from "../errors/app-error.js";

export const validatePayload = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      next(new AppError("Payload invalido", 400, details));
      return;
    }

    req.body = result.data;
    next();
  };
};
