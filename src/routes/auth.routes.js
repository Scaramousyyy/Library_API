import express from "express";
import { register, login, refresh, me } from "../controllers/auth.controller.js"; 
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";

const router = express.Router();

router.post(
    "/register", 
    authLimiter,
    validate(registerSchema),
    register
);

router.post(
    "/login", 
    authLimiter,
    validate(loginSchema),
    login
);

router.post(
    "/refresh", 
    authLimiter,
    refresh 
);

router.get(
    "/me", 
    authMiddleware,
    me
);

export default router;