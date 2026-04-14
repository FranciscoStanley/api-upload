import { z } from "zod";

const tagsPreprocessor = (value) => {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return value;
};

const booleanPreprocessor = (value) => {
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return value;
};

export const uploadBodySchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().min(1).max(500).optional(),
    tags: z.preprocess(
      tagsPreprocessor,
      z.array(z.string().trim().min(1).max(30)).max(10).optional()
    ),
    isPublic: z.preprocess(booleanPreprocessor, z.boolean().optional()),
  })
  .strict();
