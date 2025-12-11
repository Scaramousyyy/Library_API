import express from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} from "../controllers/book.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);

router.post("/", authMiddleware, requireRole(["ADMIN"]), createBook);
router.put("/:id", authMiddleware, requireRole(["ADMIN"]), updateBook);
router.delete("/:id", authMiddleware, requireRole(["ADMIN"]), deleteBook);

export default router;