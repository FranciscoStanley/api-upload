import { describe, expect, it, vi } from "vitest";
import { createUploadController } from "../../src/controllers/upload.controller.js";

const createMockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("UploadController", () => {
  it("deve responder 201 no upload single", async () => {
    const serviceMock = {
      handleSingle: vi.fn().mockResolvedValue({ message: "ok-single" }),
      handleMultiple: vi.fn(),
    };

    const controller = createUploadController(serviceMock);
    const req = {
      file: { filename: "avatar.png" },
      body: { title: "avatar" },
    };
    const res = createMockResponse();

    await controller.uploadSingle(req, res);

    expect(serviceMock.handleSingle).toHaveBeenCalledWith(req.file, req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "ok-single" });
  });

  it("deve responder 201 no upload multiple", async () => {
    const serviceMock = {
      handleSingle: vi.fn(),
      handleMultiple: vi.fn().mockResolvedValue({ message: "ok-multiple" }),
    };

    const controller = createUploadController(serviceMock);
    const req = {
      files: [{ filename: "a.png" }, { filename: "b.png" }],
      body: { title: "galeria" },
    };
    const res = createMockResponse();

    await controller.uploadMultiple(req, res);

    expect(serviceMock.handleMultiple).toHaveBeenCalledWith(req.files, req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "ok-multiple" });
  });
});
