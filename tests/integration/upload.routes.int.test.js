import fs from "fs/promises";
import path from "path";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import app from "../../app.js";

const api = request(app);
const sampleFilePath = path.resolve(process.cwd(), "tests", "fixtures", "sample.png");
const invalidFilePath = path.resolve(process.cwd(), "tests", "fixtures", "sample.txt");

const createdFiles = [];

afterEach(async () => {
  await Promise.all(
    createdFiles.splice(0).map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup errors when file was already removed.
      }
    })
  );
});

describe("Upload routes integration", () => {
  it("deve fazer upload single com payload valido", async () => {
    const response = await api
      .post("/api/v1/upload/single")
      .field("title", "Avatar")
      .field("description", "Foto de perfil")
      .field("tags", "perfil,usuario")
      .field("isPublic", "true")
      .attach("file", sampleFilePath);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Arquivo enviado com sucesso");
    expect(response.body.file).toMatchObject({
      filename: expect.any(String),
      path: expect.any(String),
      mimetype: "image/png",
      size: expect.any(Number),
    });
    expect(response.body.body).toEqual({
      title: "Avatar",
      description: "Foto de perfil",
      tags: ["perfil", "usuario"],
      isPublic: true,
    });

    createdFiles.push(response.body.file.path);
  });

  it("deve retornar 400 para payload invalido", async () => {
    const response = await api
      .post("/api/v1/upload/single")
      .field("title", "")
      .attach("file", sampleFilePath);

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Payload invalido");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "title" })])
    );
  });

  it("deve retornar 400 quando arquivo nao for enviado", async () => {
    const response = await api.post("/api/v1/upload/single").field("title", "Sem arquivo");

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Arquivo nao enviado");
  });

  it("deve fazer upload multiple com payload valido", async () => {
    const response = await api
      .post("/api/v1/upload/multiple")
      .field("title", "Galeria")
      .field("tags", "evento,imagens")
      .field("isPublic", "false")
      .attach("files", sampleFilePath)
      .attach("files", sampleFilePath);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Arquivos enviados com sucesso");
    expect(response.body.files).toHaveLength(2);
    expect(response.body.files[0]).toMatchObject({
      filename: expect.any(String),
      path: expect.any(String),
      mimetype: "image/png",
      size: expect.any(Number),
    });
    expect(response.body.body).toEqual({
      title: "Galeria",
      tags: ["evento", "imagens"],
      isPublic: false,
    });

    response.body.files.forEach((file) => createdFiles.push(file.path));
  });

  it("deve retornar 400 quando nenhum arquivo for enviado no multiple", async () => {
    const response = await api.post("/api/v1/upload/multiple").field("title", "Sem arquivos");

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Arquivos nao enviados");
  });

  it("deve retornar 400 quando exceder o limite de 5 arquivos", async () => {
    const response = await api
      .post("/api/v1/upload/multiple")
      .attach("files", sampleFilePath)
      .attach("files", sampleFilePath)
      .attach("files", sampleFilePath)
      .attach("files", sampleFilePath)
      .attach("files", sampleFilePath)
      .attach("files", sampleFilePath);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("LIMIT_UNEXPECTED_FILE");
  });

  it("deve retornar 400 para tipo de arquivo nao permitido", async () => {
    const response = await api.post("/api/v1/upload/multiple").attach("files", invalidFilePath);

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Tipo de arquivo nao permitido");
  });
});
