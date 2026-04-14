import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { validatePayload } from "../middlewares/validate-payload.middleware.js";
import { createUploadController } from "../controllers/upload.controller.js";
import { uploadBodySchema } from "../schemas/upload.schema.js";

const router = express.Router();
const controller = createUploadController();

router.post(
  "/single",
  upload.single("file"),
  validatePayload(uploadBodySchema),
  controller.uploadSingle
);

router.post(
  "/multiple",
  upload.array("files", 5),
  validatePayload(uploadBodySchema),
  controller.uploadMultiple
);

export default router;
