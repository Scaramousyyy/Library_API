import express from "express";
import { getCopies, getCopy, createCopy, updateStatusCopy, deleteCopy } from "../controllers/bookcopy.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createBookCopySchema, updateStatusCopySchema } from "../validators/bookcopy.schema.js"; 

const router = express.Router();

router.get("/", getCopies);
router.get("/:id", getCopy);

router.post(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(createBookCopySchema), 
    createCopy
);

router.put(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(updateStatusCopySchema), 
    updateStatusCopy
);

router.delete(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    deleteCopy
);

export default router;