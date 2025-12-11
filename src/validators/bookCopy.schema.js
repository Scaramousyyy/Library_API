import { z } from "zod";

export const createBookCopySchema = z.object({
  bookId: z.number().int(),
  barcode: z.string().min(3),
});

export const updateStatusCopySchema = z.object({
  status: z.enum(["AVAILABLE", "BORROWED", "LOST", "MAINTENANCE"]),
});