import { PrismaClient } from "@prisma/client";
import { bookSchema } from "../validators/book.schema.js";

const prisma = new PrismaClient();

export const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ data: books });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
        copies: true,
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ data: book });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const data = bookSchema.parse(req.body);

    const authorCreationData = data.authorNames.map((name) => ({
      author: { 
        connectOrCreate: {
          where: { name: name.trim() },
          create: { name: name.trim() },
        },
      },
    }));

    const categoryCreationData = data.categoryNames.map((name) => ({
      category: {
        connectOrCreate: {
          where: { name: name.trim() },
          create: { name: name.trim() },
        },
      },
    }));

    const book = await prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        isbn: data.isbn,
        publisher: data.publisher,
        year: data.year,

        // Membuat relasi Author (BookAuthor)
        authors: {
          create: authorCreationData,
        },

        // Membuat relasi Category (BookCategory)
        categories: {
          create: categoryCreationData,
        },
      },

      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
      },
    });

    return res.status(201).json({
      message: "Book created",
      data: book,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = bookSchema.parse(req.body);

    const authorData = data.authorNames
      ? data.authorNames.map((name) => ({
          connectOrCreate: {
            where: { name: name.trim() },
            create: { name: name.trim() },
          },
        }))
      : [];

    const categoryData = data.categoryNames
      ? data.categoryNames.map((name) => ({
          connectOrCreate: {
            where: { name: name.trim() },
            create: { name: name.trim() },
          },
        }))
      : [];

    const result = await prisma.$transaction(async (tx) => {
      if (data.authorNames) {
            await tx.bookAuthor.deleteMany({ where: { bookId: id } });
        }

      if (data.categoryNames) {
            await tx.bookCategory.deleteMany({ where: { bookId: id } });
        }

      const updatedBook = await tx.book.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                isbn: data.isbn,
                publisher: data.publisher,
                year: data.year,
                
                authors: data.authorNames ? { 
                    create: authorData.map(item => ({
                        author: item
                    }))
                } : undefined,

                categories: data.categoryNames ? { 
                    create: categoryData.map(item => ({
                        category: item
                    }))
                } : undefined,
            },
            include: {
                authors: { include: { author: true } },
                categories: { include: { category: true } },
            },
        });
        
        return updatedBook;
    });

    return res.json({
      message: "Book updated",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.bookAuthor.deleteMany({ where: { bookId: id } });
    await prisma.bookCategory.deleteMany({ where: { bookId: id } });
    await prisma.bookCopy.deleteMany({ where: { bookId: id } });

    await prisma.book.delete({
      where: { id }
    });

    return res.json({ message: "Book deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};