import { z } from "zod";

const passwordRequirement = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");


export const registerSchema = z.object({
    // User Model membutuhkan 'role', namun role akan diatur di controller (default USER)
    email: z.string().email("Invalid email format"),
    password: passwordRequirement,
    name: z.string().min(1, "Name cannot be empty"),
    // Jika Anda ingin mengizinkan ADMIN membuat ADMIN, Anda bisa menambahkan:
    // role: z.enum(["USER", "ADMIN"]).optional(), 
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"), // Tidak perlu cek kompleksitas saat login
});