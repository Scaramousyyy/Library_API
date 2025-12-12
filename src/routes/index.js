import express from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./user.routes.js";
import authorsRoutes from "./author.routes.js";
import categoriesRoutes from "./category.routes.js";
import booksRoutes from "./book.routes.js";
import bookCopiesRoutes from "./bookcopy.routes.js";
import loansRoutes from "./loan.routes.js";
import { generalLimiter } from "../middleware/ratelimit.middleware.js";

const router = express.Router();

// --- Apply General Rate Limiter to All Routes ---
router.use(generalLimiter);

// --- Health Check Endpoint ---
router.get("/health", (req, res) => {
    res.json({ 
        success: true, 
        message: "API server is healthy", 
        timestamp: new Date().toISOString() 
    });
});

// --- Register Semua Modular Routes ke Prefix /api ---
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/authors", authorsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/books", booksRoutes);
router.use("/copies", bookCopiesRoutes); 
router.use("/loans", loansRoutes);

router.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
});

export default router;