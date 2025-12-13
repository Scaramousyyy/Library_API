import prisma from '../config/database.js';
import { buildSuccessResponse } from '../utils/response.util.js'; 
import { buildQueryOptions } from '../utils/query.util.js'; 
import { buildPaginationMeta } from '../utils/pagination.util.js'; 

const categoryInclude = {
    books: { 
        select: { 
            book: {
                select: { id: true, title: true }
            }
        } 
    }, 
};


export const getCategories = async (req, res, next) => {
    
    // 1. Dapatkan opsi query
    const allowedFilters = [];
    const searchFields = ['name'];
    
    const { skip, take, paginationMeta, where, orderBy } = buildQueryOptions(
        req, 
        allowedFilters, 
        searchFields
    );
    
    // 2. Dapatkan total records 
    const totalRecords = await prisma.category.count({ where });

    // 3. Dapatkan data Categories
    const categories = await prisma.category.findMany({
        skip,
        take,
        where,
        orderBy,
        include: categoryInclude,
    });

    // 4. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    // 5. Respon dengan format standar (termasuk pagination)
    return res.json(buildSuccessResponse(
        "Categories fetched successfully", 
        categories,
        pagination 
    ));
};

export const getCategory = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
        where: { id },
        include: categoryInclude,
    });

    if (!category) {
        return res.status(404).json({ 
            success: false, 
            message: "Category not found" 
        });
    }

    return res.json(buildSuccessResponse(
        "Category fetched successfully", 
        category
    ));
};

export const createCategory = async (req, res, next) => {
    const data = req.body; 
    
    const category = await prisma.category.create({
        data: data,
    });

    return res.status(201).json(buildSuccessResponse(
        "Category created successfully",
        category
    ));
};

export const updateCategory = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const data = req.body; 
    
    const updated = await prisma.category.update({
        where: { id },
        data: data,
    });

    return res.json(buildSuccessResponse(
        "Category updated successfully",
        updated
    ));
};

export const deleteCategory = async (req, res, next) => {
    const id = parseInt(req.params.id);

    await prisma.category.delete({
        where: { id },
    });

    return res.status(204).send();
};