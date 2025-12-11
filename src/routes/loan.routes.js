import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { borrowBook, returnBook, getAllLoans, getMyLoans } from "../controllers/loan.controller.js";
import { borrowSchema, returnSchema } from "../validators/loan.validator.js"; 

const router = express.Router();

router.post(
    "/borrow", 
    authMiddleware, 
    validate(borrowSchema),
    borrowBook
);

router.post(
    "/:id/return", 
    authMiddleware, 
    validate(returnSchema),
    returnBook
);

router.get(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]),
    getAllLoans
);

router.get(
    "/me", 
    authMiddleware, 
    getMyLoans
);

export default router;