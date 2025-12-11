import prisma from '../config/database.js';
import { buildSuccessResponse } from '../utils/response.util.js'; 
import { buildQueryOptions } from '../utils/queryBuilder.js'; 
import { buildPaginationMeta } from '../utils/pagination.util.js'; 

const loanInclude = {
    user: { select: { id: true, name: true, email: true } },
    bookCopy: { 
        include: { 
            book: { 
                select: { id: true, title: true, isbn: true } 
            } 
        } 
    }
};

export const borrowBook = async (req, res, next) => {
    const userId = req.user.userId;
    const { bookCopyId, days } = req.body; 

    const result = await prisma.$transaction(async (tx) => {
        
        // 1. Cek Salinan Buku
        const copy = await tx.bookCopy.findUnique({
            where: { id: bookCopyId }
        });

        if (!copy) {
            return res.status(404).json({ success: false, message: "Book copy not found" });
        }

        if (copy.status !== "AVAILABLE") {
            return res.status(400).json({ success: false, message: "Book copy not available" });
        }

        // 2. Cek Pinjaman Berlangsung
        const existingLoan = await tx.loan.findFirst({
            where: { userId, bookCopyId, status: "ONGOING" }
        });

        if (existingLoan) {
            return res.status(409).json({
                success: false,
                message: "You already have an ongoing loan for this book copy"
            });
        }

        // 3. Hitung Tanggal Jatuh Tempo
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + days);

        // 4. Buat Loan
        const loan = await tx.loan.create({
            data: {
                userId,
                bookCopyId,
                dueDate: dueDate,
            },
            include: loanInclude,
        });

        // 5. Update status salinan buku
        await tx.bookCopy.update({
            where: { id: bookCopyId },
            data: { status: "BORROWED" }
        });

        return loan;
    });

    return res.status(201).json(buildSuccessResponse(
        "Book borrowed successfully",
        result
    ));
};

export const returnBook = async (req, res, next) => {
    const loanId = parseInt(req.params.id);
    const user = req.user;
    const { returnedAt: returnedAtBody } = req.body;

    const returnedAt = returnedAtBody ? new Date(returnedAtBody) : new Date();

    const result = await prisma.$transaction(async (tx) => {
        
        // 1. Cari Loan
        const loan = await tx.loan.findUnique({
            where: { id: loanId },
            include: { bookCopy: true }
        });

        if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });

        // 2. Otorisasi Kepemilikan (Wajib)
        if (user.role !== "ADMIN" && loan.userId !== user.userId) { // Pastikan menggunakan user.userId dari token
            return res.status(403).json({ success: false, message: "Forbidden: You are not authorized to close this loan" });
        }

        // 3. Cek Status Pinjaman
        if (loan.status !== "ONGOING") {
            return res.status(400).json({ success: false, message: "Loan is already completed or canceled" });
        }

        // 4. Tentukan Status Pengembalian
        let status = "RETURNED";
        if (returnedAt > loan.dueDate) {
            status = "LATE";
        }

        // 5. Update Loan
        const updatedLoan = await tx.loan.update({
            where: { id: loanId },
            data: {
                returnedAt,
                status
            },
            include: loanInclude,
        });

        // 6. Update Book Copy Status ke AVAILABLE
        await tx.bookCopy.update({
            where: { id: loan.bookCopyId },
            data: { status: "AVAILABLE" }
        });

        return updatedLoan;
    });


    return res.json(buildSuccessResponse(
        "Book returned successfully",
        result
    ));
};

export const getAllLoans = async (req, res, next) => {
    // 1. Dapatkan opsi query
    const allowedFilters = ['status', 'userId']; 
    const searchFields = []; 
    
    const { skip, take, paginationMeta, where, orderBy } = buildQueryOptions(
        req, 
        allowedFilters, 
        searchFields
    );
    
    // 2. Dapatkan total records 
    const totalRecords = await prisma.loan.count({ where });

    // 3. Dapatkan data Loans
    const loans = await prisma.loan.findMany({
        skip,
        take,
        where,
        orderBy,
        include: loanInclude,
    });

    // 4. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    return res.json(buildSuccessResponse(
        "All loans fetched successfully", 
        loans,
        pagination 
    ));
};

export const getMyLoans = async (req, res, next) => {
    const userId = req.user.userId;
    
    // 1. Dapatkan opsi query
    const { skip, take, paginationMeta, orderBy } = buildQueryOptions(req);
    
    // 2. Filter wajib berdasarkan userId
    const where = { userId };
    
    // 3. Dapatkan total records 
    const totalRecords = await prisma.loan.count({ where });

    // 4. Dapatkan data Loans
    const loans = await prisma.loan.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
            bookCopy: { include: { book: { select: { id: true, title: true } } } }
        },
    });

    // 5. Buat objek pagination metadata
    const pagination = buildPaginationMeta(
        totalRecords, 
        paginationMeta.page, 
        paginationMeta.limit
    );

    return res.json(buildSuccessResponse(
        "My loans fetched successfully", 
        loans,
        pagination 
    ));
};