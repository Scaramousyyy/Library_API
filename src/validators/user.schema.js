import { z } from "zod";
import { passwordRequirement } from "./auth.validator.js"; 

const RoleEnum = z.enum(["USER", "ADMIN"]);

export const createUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(1, "Name cannot be empty"),
    password: passwordRequirement, 
    role: RoleEnum.default("USER"), 
});


export const updateUserSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    name: z.string().min(1, "Name cannot be empty").optional(),
    password: passwordRequirement.optional(), 
    role: RoleEnum.optional(), 
}).partial();

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordRequirement, 
});