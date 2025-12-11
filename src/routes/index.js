import express from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import authorsRoutes from "./authors.routes.js";
import categoriesRoutes from "./categories.routes.js";
import booksRoutes from "./books.routes.js";
import bookCopiesRoutes from "./bookCopies.routes.js";
import loansRoutes from "./loans.routes.js";

const router = express.Router();

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