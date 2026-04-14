import { describe, expect, it, vi } from "vitest";
import { UploadService } from "../../src/services/upload.service.js";
import { AppError } from "../../src/errors/app-error.js";

describe("UploadService", () => {
  it("deve processar upload unico", async () => {
    const file = {
      filename: "file-1.png",
      path: "src/uploads/file-1.png",
      mimetype: "image/png",
      size: 123,
    };

    const repositoryMock = {
      saveFile: vi.fn().mockResolvedValue(file),
      saveFiles: vi.fn(),
    };

    const service = new UploadService(repositoryMock);

    const result = await service.handleSingle(file, { title: "avatar" });

    expect(repositoryMock.saveFile).toHaveBeenCalledWith(file);
    expect(result).toEqual({
      message: "Arquivo enviado com sucesso",
      file,
      body: { title: "avatar" },
    });
  });

  it("deve lancar erro quando arquivo unico nao for enviado", async () => {
    const repositoryMock = {
      saveFile: vi.fn(),
      saveFiles: vi.fn(),
    };

    const service = new UploadService(repositoryMock);

    await expect(service.handleSingle(null, {})).rejects.toBeInstanceOf(AppError);
    await expect(service.handleSingle(null, {})).rejects.toMatchObject({
      message: "Arquivo nao enviado",
      statusCode: 400,
    });
  });

  it("deve processar upload multiplo", async () => {
    const files = [
      {
        filename: "file-1.png",
        path: "src/uploads/file-1.png",
        mimetype: "image/png",
        size: 123,
      },
      {
        filename: "file-2.jpg",
        path: "src/uploads/file-2.jpg",
        mimetype: "image/jpeg",
        size: 456,
      },
    ];

    const repositoryMock = {
      saveFile: vi.fn(),
      saveFiles: vi.fn().mockResolvedValue(files),
    };

    const service = new UploadService(repositoryMock);

    const result = await service.handleMultiple(files, { title: "galeria" });

    expect(repositoryMock.saveFiles).toHaveBeenCalledWith(files);
    expect(result).toEqual({
      message: "Arquivos enviados com sucesso",
      files,
      body: { title: "galeria" },
    });
  });

  it("deve lancar erro quando lista de arquivos estiver vazia", async () => {
    const repositoryMock = {
      saveFile: vi.fn(),
      saveFiles: vi.fn(),
    };

    const service = new UploadService(repositoryMock);

    await expect(service.handleMultiple([], {})).rejects.toBeInstanceOf(AppError);
    await expect(service.handleMultiple([], {})).rejects.toMatchObject({
      message: "Arquivos nao enviados",
      statusCode: 400,
    });
  });
});
