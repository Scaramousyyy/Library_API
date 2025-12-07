import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await comparePassword(data.password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      role: user.role,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};