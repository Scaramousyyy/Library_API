import prisma from '../config/database.js';
import { borrowSchema, returnSchema } from "../validators/loan.schema.js";

export const borrowBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookCopyId, days } = borrowSchema.parse(req.body);

    const copy = await prisma.bookCopy.findUnique({
      where: { id: bookCopyId }
    });

    if (!copy) {
      return res.status(404).json({ message: "Book copy not found" });
    }

    if (copy.status !== "AVAILABLE") {
      return res.status(400).json({ message: "Book copy not available" });
    }

    // Check existing Loan
    const existingLoan = await prisma.loan.findFirst({
      where: {
        userId,
        bookCopyId,
        status: "ONGOING"
      }
    });

    if (existingLoan) {
      return res.status(409).json({
        message: "You already borrowed this book copy"
      });
    }

    const now = new Date();
    const due = new Date(now);
    due.setDate(now.getDate() + days);

    const loan = await prisma.loan.create({
      data: {
        userId,
        bookCopyId,
        dueDate: due
      }
    });

    // Update book copy status
    await prisma.bookCopy.update({
      where: { id: bookCopyId },
      data: { status: "BORROWED" }
    });

    return res.status(201).json({
      message: "Book borrowed successfully",
      data: loan
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const loanId = parseInt(req.params.id);
    const user = req.user;

    const body = returnSchema.parse(req.body);
    const returnedAt = body.returnedAt ? new Date(body.returnedAt) : new Date();

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { bookCopy: true }
    });

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (user.role !== "ADMIN" && loan.userId !== user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (loan.status !== "ONGOING") {
      return res.status(400).json({ message: "Loan already completed" });
    }

    let status = "RETURNED";
    if (returnedAt > loan.dueDate) {
      status = "LATE";
    }

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        returnedAt,
        status
      }
    });

    await prisma.bookCopy.update({
      where: { id: loan.bookCopyId },
      data: { status: "AVAILABLE" }
    });

    return res.json({
      message: "Book returned successfully",
      data: updatedLoan
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        user: true,
        bookCopy: {
          include: { book: true }
        }
      }
    });

    return res.json({ data: loans });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyLoans = async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.user.id },
      include: {
        bookCopy: { include: { book: true } }
      }
    });

    return res.json({ data: loans });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
