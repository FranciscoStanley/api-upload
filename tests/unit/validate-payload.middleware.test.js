import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../src/errors/app-error.js";
import { validatePayload } from "../../src/middlewares/validate-payload.middleware.js";
import { uploadBodySchema } from "../../src/schemas/upload.schema.js";

describe("validatePayload middleware", () => {
  it("deve validar e normalizar payload valido", () => {
    const middleware = validatePayload(uploadBodySchema);
    const req = {
      body: {
        title: "Avatar",
        description: "Foto de perfil",
        tags: "perfil, usuario",
        isPublic: "true",
      },
    };
    const res = {};
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({
      title: "Avatar",
      description: "Foto de perfil",
      tags: ["perfil", "usuario"],
      isPublic: true,
    });
  });

  it("deve retornar AppError quando payload for invalido", () => {
    const middleware = validatePayload(uploadBodySchema);
    const req = {
      body: {
        title: 123,
      },
    };
    const res = {};
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Payload invalido");
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "title" })])
    );
  });

  it("deve retornar AppError para campo nao permitido", () => {
    const middleware = validatePayload(uploadBodySchema);
    const req = {
      body: {
        title: "ok",
        unexpected: "nao permitido",
      },
    };
    const res = {};
    const next = vi.fn();

    middleware(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.details.length).toBeGreaterThan(0);
  });
});
