import prisma from '../config/database.js';
import { buildSuccessResponse } from '../utils/response.util.js'; 
import { buildQueryOptions } from '../utils/query.util.js'; 
import { buildPaginationMeta } from '../utils/pagination.util.js'; 

const copyInclude = {
    book: { select: { id: true, title: true, isbn: true } },
    loans: { take: 1, orderBy: { borrowedAt: 'desc' } }
}; 

export const getCopies = async (req, res, next) => {
    
    // 1. Dapatkan opsi query
    const allowedFilters = ['status', 'bookId']; 
    const searchFields = ['barcode']; 
    
    const { skip, take, paginationMeta, where, orderBy } = buildQueryOptions(
        req, 
        allowedFilters, 
        searchFields
    );
    
    // 2. Dapatkan total records 
    const totalRecords = await prisma.bookCopy.count({ where });

    // 3. Dapatkan data Copies
    const copies = await prisma.bookCopy.findMany({
        skip,
        take,
        where,
        orderBy,
        include: copyInclude,
    });

    // 4. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    // 5. Respon Sukses
    return res.json(buildSuccessResponse(
        "Book copies fetched successfully", 
        copies,
        pagination 
    ));
};

export const getCopy = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const copy = await prisma.bookCopy.findUnique({
        where: { id },
        include: copyInclude,
    });

    if (!copy) {
        return res.status(404).json({ 
            success: false, 
            message: "Book copy not found" 
        });
    }

    return res.json(buildSuccessResponse(
        "Book copy fetched successfully", 
        copy
    ));
};

export const createCopy = async (req, res, next) => {
    const { bookId, barcode } = req.body; 

    const book = await prisma.book.findUnique({
        where: { id: bookId },
    });

    if (!book) {
        return res.status(404).json({ 
            success: false, 
            message: "Parent book not found" 
        });
    }

    const copy = await prisma.bookCopy.create({
        data: {
            bookId,
            barcode,
        },
    });

    return res.status(201).json(buildSuccessResponse(
        "Book copy created successfully",
        copy
    ));
};

export const updateStatusCopy = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const copy = await prisma.bookCopy.update({
        where: { id },
        data: { status },
        include: copyInclude
    });

    return res.json(buildSuccessResponse(
        "Book copy status updated successfully",
        copy
    ));
};

export const deleteCopy = async (req, res, next) => {
    const id = parseInt(req.params.id);

    await prisma.bookCopy.delete({
        where: { id },
    });

    return res.status(204).send();
};