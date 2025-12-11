import prisma from '../config/database.js';
import { createBookCopySchema, updateStatusCopySchema } from "../validators/bookCopy.schema.js";

export const getCopies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [total, copies] = await Promise.all([
      prisma.bookCopy.count(),
      prisma.bookCopy.findMany({
        skip,
        take: limit,
        include: {
          book: true,
        },
        orderBy: { id: "asc" },
      }),
    ]);

    return res.json({
      data: copies,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCopy = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const copy = await prisma.bookCopy.findUnique({
      where: { id },
      include: { book: true, loans: true },
    });

    if (!copy) {
      return res.status(404).json({ message: "Copy not found" });
    }

    return res.json({ data: copy });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCopy = async (req, res) => {
  try {
    const data = createBookCopySchema.parse(req.body);

    const book = await prisma.book.findUnique({
      where: { id: data.bookId },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const copy = await prisma.bookCopy.create({
      data: {
        bookId: data.bookId,
        barcode: data.barcode,
      },
    });

    return res.status(201).json({
      message: "Book copy created",
      data: copy,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateStatusCopy = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = updateStatusCopySchema.parse(req.body);

    const copy = await prisma.bookCopy.update({
      where: { id },
      data: { status: data.status },
    });

    return res.json({
      message: "Book copy updated",
      data: copy,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteCopy = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.bookCopy.delete({
      where: { id },
    });

    return res.json({ message: "Book copy deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
