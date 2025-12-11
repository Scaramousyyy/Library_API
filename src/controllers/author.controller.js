import prisma from '../config/database.js';
import { authorSchema } from "../validators/author.schema.js";

export const getAuthors = async (req, res) => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { id: "asc" },
    });

    return res.json({ data: authors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.json({ data: author });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const data = authorSchema.parse(req.body);

    const author = await prisma.author.create({
      data,
    });

    return res.status(201).json({
      message: "Author created",
      data: author,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = authorSchema.parse(req.body);

    const updated = await prisma.author.update({
      where: { id },
      data,
    });

    return res.json({
      message: "Author updated",
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.author.delete({
      where: { id },
    });

    return res.json({ message: "Author deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};