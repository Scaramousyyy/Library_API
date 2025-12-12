import express from "express";
import { getBooks, getBook, createBook, updateBook, deleteBook } from "../controllers/book.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js"; 
import { bookSchema } from "../validators/book.schema.js"; 

const updateBookSchema = bookSchema.partial(); 

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);

router.post(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(bookSchema), 
    createBook
);

router.put(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(updateBookSchema), 
    updateBook
);

router.delete(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    deleteBook
);

export default router;