import express from "express";
import { register, login, refresh, me } from "../controllers/auth.controller.js"; 
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, refreshSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post(
    "/register", 
    validate(registerSchema),
    register
);

router.post(
    "/login", 
    validate(loginSchema),
    login
);

router.post(
    "/refresh", 
    validate(refreshSchema),
    refresh 
);

router.get(
    "/me", 
    authMiddleware,
    me
);

export default router;