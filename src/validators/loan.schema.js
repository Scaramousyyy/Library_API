import { z } from "zod";

export const borrowSchema = z.object({
  bookCopyId: z.number(),
  days: z.number().min(1).max(30) // max 30 hari
});     

export const returnSchema = z.object({
  returnedAt: z.string().datetime().optional()
});