import express from "express";
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory }from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { categorySchema } from "../validators/category.schema.js"; 

const updateCategorySchema = categorySchema.partial();

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(categorySchema),
    createCategory
);

router.put(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(updateCategorySchema),
    updateCategory
);

router.delete(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    deleteCategory
);

export default router;