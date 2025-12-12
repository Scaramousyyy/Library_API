import prisma from '../config/database.js';
import { buildSuccessResponse } from '../utils/response.util.js'; 
import { buildQueryOptions } from '../utils/query.util.js'; 
import { buildPaginationMeta } from '../utils/pagination.util.js'; 
import { ConnectOrCreate } from '../utils/mapname.util.js';

const bookInclude = {
    authors: { include: { author: { select: { id: true, name: true } } } },
    categories: { include: { category: { select: { id: true, name: true } } } },
};

export const getBooks = async (req, res, next) => {
    
    const allowedFilters = ['year', 'publisher']; 
    const searchFields = ['title', 'description']; 
    
    // 1. Dapatkan opsi query (skip, take, where, orderBy)
    const { skip, take, paginationMeta, where, orderBy } = buildQueryOptions(
        req, 
        allowedFilters, 
        searchFields
    );
    
    // 2. Dapatkan total records 
    const totalRecords = await prisma.book.count({ where });

    // 3. Dapatkan data buku
    const books = await prisma.book.findMany({
        skip,
        take,
        where,
        orderBy,
        include: bookInclude,
    });

    // 4. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    // 5. Respon Sukses
    return res.json(buildSuccessResponse(
        "Books fetched successfully with pagination", 
        books,
        pagination 
    ));
};

export const getBook = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const book = await prisma.book.findUnique({
        where: { id },
        include: {
            ...bookInclude,
            copies: true,
        },
    });

    if (!book) {
        return res.status(404).json({ 
            success: false, 
            message: "Book not found" 
        });
    }

    return res.json(buildSuccessResponse(
        "Book fetched successfully", 
        book
    ));
};

export const createBook = async (req, res, next) => {
    const data = req.body; 

    const authorCreationData = ConnectOrCreate(data.authorNames, 'author');
    const categoryCreationData = ConnectOrCreate(data.categoryNames, 'category');

    const book = await prisma.book.create({
        data: {
            title: data.title,
            description: data.description,
            isbn: data.isbn,
            publisher: data.publisher,
            year: data.year,

            authors: { create: authorCreationData },
            categories: { create: categoryCreationData },
        },
        include: bookInclude,
    });

    return res.status(201).json(buildSuccessResponse(
        "Book created successfully",
        book
    ));
};

export const updateBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const data = req.body; 

    // 1. Gunakan transaksi untuk atomisitas
    const result = await prisma.$transaction(async (tx) => {
        
        // 2. Jika array AuthorNames ada di request, hapus relasi lama
        if (data.authorNames) {
            await tx.bookAuthor.deleteMany({ where: { bookId: id } });
        }
        // 3. Jika array CategoryNames ada di request, hapus relasi lama
        if (data.categoryNames) {
            await tx.bookCategory.deleteMany({ where: { bookId: id } });
        }

        // 4. Siapkan data untuk update
        const updateData = {
            ...data, 
            
            ...(data.authorNames && {
                authors: {
                    create: ConnectOrCreate(data.authorNames, 'author'),
                }
            }),
            ...(data.categoryNames && {
                categories: {
                    create: ConnectOrCreate(data.categoryNames, 'category'),
                }
            }),
        };
        
        delete updateData.authorNames;
        delete updateData.categoryNames;

        // 5. Update Book
        const updatedBook = await tx.book.update({
            where: { id },
            data: updateData,
            include: bookInclude,
        });
        
        return updatedBook;
    });

    return res.json(buildSuccessResponse(
        "Book updated successfully",
        result
    ));
};

export const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id);

    await prisma.book.delete({
        where: { id }
    });

    return res.status(204).json({
        success: true,
        message: "Book deleted successfully"
    });
};