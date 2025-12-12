import rateLimit from "express-rate-limit";

// --- 1. Konfigurasi Dasar (Untuk endpoint umum seperti GET /books) ---
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, 
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
}); 

// --- 2. Konfigurasi Khusus (Untuk login/register, cegah Brute Force)---
export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts from this IP, please try again after 5 minutes",
    },
    
    skipSuccessfulRequests: true, 
});