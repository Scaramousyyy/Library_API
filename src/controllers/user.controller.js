import prisma from '../config/database.js';
import { buildSuccessResponse } from '../utils/response.util.js'; 
import { buildQueryOptions } from '../utils/query.util.js'; 
import { buildPaginationMeta } from '../utils/pagination.util.js'; 
import { hashPassword } from "../utils/hash.util.js";

const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

export const getUsers = async (req, res, next) => {
    
    const allowedFilters = ['role']; 
    const searchFields = ['name', 'email']; 
    
    // 1. Dapatkan opsi query
    const { skip, take, paginationMeta, where, orderBy } = buildQueryOptions(
        req, 
        allowedFilters, 
        searchFields
    );
    
    // 2. Dapatkan total records 
    const totalRecords = await prisma.user.count({ where });

    // 3. Dapatkan data Users
    const users = await prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: userSelect,
    });

    // 4. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    // 5. Respon Sukses
    return res.json(buildSuccessResponse(
        "Users fetched successfully", 
        users,
        pagination 
    ));
};

export const getUser = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const authenticatedUserId = req.user.userId;

    if (req.user.role !== 'ADMIN' && id !== authenticatedUserId) {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden: You do not have permission to view this user profile." 
        });
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: userSelect,
    });

    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: "User not found" 
        });
    }

    return res.json(buildSuccessResponse(
        "User fetched successfully", 
        user
    ));
};

export const createUser = async (req, res, next) => {
    const { email, password, name, role } = req.body; 

    // 1. Hash password
    const hashedPassword = await hashPassword(password);

    // 2. Buat user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role,
        },
        select: userSelect,
    });

    return res.status(201).json(buildSuccessResponse(
        "User created successfully",
        user
    ));
};

export const updateUser = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const data = req.body; 
    const authenticatedUserId = req.user.userId;

    if (req.user.role !== 'ADMIN' && id !== authenticatedUserId) {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden: You can only update your own profile." 
        });
    }

    if (data.password) {
        data.password = await hashPassword(data.password);
    }
    
    if (data.role && req.user.role !== 'ADMIN') {
         return res.status(403).json({ 
            success: false, 
            message: "Forbidden: Only Admin can change user roles." 
        });
    }


    const updated = await prisma.user.update({
        where: { id },
        data,
        select: userSelect,
    });

    return res.json(buildSuccessResponse(
        "User updated successfully",
        updated
    ));
};

export const deleteUser = async (req, res, next) => {
    const id = parseInt(req.params.id);

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden: Only Admin can delete users." 
        });
    }

    if (id === req.user.userId) {
        return res.status(400).json({ 
            success: false, 
            message: "Cannot delete your own account via this endpoint." 
        });
    }

    await prisma.user.delete({
        where: { id },
    });

    return res.status(204).send();
};