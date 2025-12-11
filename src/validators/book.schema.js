import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().min(1500).max(new Date().getFullYear()),
  categoryId: z.number().int().positive(),
  authorId: z.number().int().positive(),
});