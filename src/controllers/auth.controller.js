import prisma from '../config/database.js';
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.util.js";

export const register = async (req, res, next) => {
    const { email, password, name } = req.body;
    
    // 1. Hash password
    const hashedPassword = await hashPassword(password);

    // 2. Buat user baru
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'USER',
        },
        select: { id: true, email: true, name: true, role: true },
    });

    // 3. Respon Sukses
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Cari user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    // 2. Cek user dan password
    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials (email or password)",
        });
    }

    // 3. Buat token
    const accessToken = signAccessToken({
        userId: user.id,
        role: user.role,
    });

    const refreshToken = signRefreshToken({
        userId: user.id,
        role: user.role,
    });

    // 4. Respon Sukses
    return res.json({
        success: true,
        message: "Login successful",
        data: {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
};

export const refresh = async (req, res, next) => {
    // 1. Ambil refresh token
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token is required",
        });
    }

    try {
        // 2. Verifikasi refresh token.
        const decoded = verifyRefreshToken(refreshToken);

        // 3. Ekstrak data user dari payload token yang sudah di-decode
        const { userId, role } = decoded;

        // 4. Buat Access Token baru
        const newAccessToken = signAccessToken({ userId, role });

        // 5. Respon Sukses
        return res.json({
            success: true,
            message: "New access token generated successfully",
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const me = async (req, res, next) => {
    // 1. Ambil userId
    const userId = req.user.userId; 

    // 2. Cari data user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
            id: true, 
            email: true, 
            name: true, 
            role: true 
        },
    });

    // 3. Handle jika user tidak ditemukan
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User profile not found",
        });
    }

    // 4. Respon Sukses
    return res.json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
    });
};