import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  borrowBook,
  returnBook,
  getAllLoans,
  getMyLoans
} from "../controllers/loan.controller.js";

const router = express.Router();

router.post("/borrow", authMiddleware, borrowBook);
router.post("/:id/return", authMiddleware, returnBook);

router.get("/", authMiddleware, requireRole("ADMIN"), getAllLoans);
router.get("/me", authMiddleware, getMyLoans);

export default router;
