import { UploadService } from "../services/upload.service.js";

export const createUploadController = (uploadService = new UploadService()) => {
  return {
    uploadSingle: async (req, res) => {
      const response = await uploadService.handleSingle(req.file, req.body);
      res.status(201).json(response);
    },

    uploadMultiple: async (req, res) => {
      const response = await uploadService.handleMultiple(req.files, req.body);
      res.status(201).json(response);
    },
  };
};
