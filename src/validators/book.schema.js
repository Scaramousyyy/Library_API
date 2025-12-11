import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().min(1500).max(new Date().getFullYear()),
  authorNames: z.array(z.string().min(1, "Author name cannot be empty")).min(1, "At least one author is required"),
  categoryNames: z.array(z.string().min(1, "Category name cannot be empty")).min(1, "At least one category is required"),
});