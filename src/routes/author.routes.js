import express from "express";
import { getAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor } from "../controllers/author.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authorSchema } from "../validators/author.schema.js"; 

const updateAuthorSchema = authorSchema.partial();

const router = express.Router();

router.get("/", getAuthors);
router.get("/:id", getAuthor);

router.post(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(authorSchema),
    createAuthor
);

router.put(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(updateAuthorSchema),
    updateAuthor
);

router.delete(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    deleteAuthor
);

export default router;