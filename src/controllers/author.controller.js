import prisma from '../config/database.js';
import { buildSuccessResponse } from '../utils/response.util.js'; 
import { buildQueryOptions } from '../utils/query.util.js';
import { buildPaginationMeta } from '../utils/pagination.util.js';

const authorInclude = {
    books: { 
        select: { 
            book: {
                select: { id: true, title: true }
            }
        } 
    }
};

export const getAuthors = async (req, res, next) => {
    // 1. Dapatkan opsi query
    const allowedFilters = [];
    const searchFields = ['name', 'bio']; 
    
    const { skip, take, paginationMeta, where, orderBy } = buildQueryOptions(
        req, 
        allowedFilters, 
        searchFields
    );
    
    // 2. Dapatkan total records untuk pagination
    const totalRecords = await prisma.author.count({ where });

    // 3. Dapatkan data Authors
    const authors = await prisma.author.findMany({
        skip,
        take,
        where,
        orderBy,
        include: authorInclude,
    });

    // 4. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    // 5. Respon dengan format standar (termasuk pagination)
    return res.json(buildSuccessResponse(
        "Authors fetched successfully", 
        authors,
        pagination
    ));
};

export const getAuthor = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const author = await prisma.author.findUnique({
        where: { id },
        include: authorInclude,
    });

    if (!author) {
        return res.status(404).json({ 
            success: false, 
            message: "Author not found" 
        });
    }

    return res.json(buildSuccessResponse(
        "Author fetched successfully", 
        author
    ));
};

export const createAuthor = async (req, res, next) => {
    const data = req.body; 
    
    const author = await prisma.author.create({
        data,
    });

    return res.status(201).json(buildSuccessResponse(
        "Author created successfully",
        author
    ));
};

export const updateAuthor = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const data = req.body; 

    const updated = await prisma.author.update({
        where: { id },
        data,
    });

    return res.json(buildSuccessResponse(
        "Author updated successfully",
        updated
    ));
};

export const deleteAuthor = async (req, res, next) => {
    const id = parseInt(req.params.id);

    await prisma.author.delete({
        where: { id },
    });

    return res.status(204).json({
        success: true,
        message: "Author deleted successfully"
    });
};