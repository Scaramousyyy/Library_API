import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js"; 

const router = express.Router();

router.get(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]),
    getUsers
);

router.get(
    "/:id", 
    authMiddleware, 
    getUser
);

router.post(
    "/", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    validate(createUserSchema), 
    createUser
);

router.put(
    "/:id", 
    authMiddleware, 
    validate(updateUserSchema), 
    updateUser
);

router.delete(
    "/:id", 
    authMiddleware, 
    requireRole(["ADMIN"]), 
    deleteUser
);

export default router;