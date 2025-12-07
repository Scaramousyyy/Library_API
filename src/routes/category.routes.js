import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post("/", authMiddleware, requireRole(["ADMIN"]), createCategory);
router.put("/:id", authMiddleware, requireRole(["ADMIN"]), updateCategory);
router.delete("/:id", authMiddleware, requireRole(["ADMIN"]), deleteCategory);

export default router;