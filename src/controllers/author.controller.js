import { PrismaClient } from "@prisma/client";
import { authorSchema } from "../validators/author.schema.js";

const prisma = new PrismaClient();

export const getAuthors = async (req, res) => {
  const authors = await prisma.author.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.json(authors);
};

export const getAuthor = async (req, res) => {
  const id = Number(req.params.id);

  const author = await prisma.author.findUnique({
    where: { id },
  });

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  return res.json(author);
};

export const createAuthor = async (req, res) => {
  try {
    const data = authorSchema.parse(req.body);

    const exists = await prisma.author.findFirst({
      where: { name: data.name },
    });

    if (exists) {
      return res.status(400).json({ message: "Author already exists" });
    }

    const author = await prisma.author.create({ data });

    return res.status(201).json({
      message: "Author created",
      author,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = authorSchema.parse(req.body);

    const exists = await prisma.author.findFirst({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: "Author not found" });
    }

    const updated = await prisma.author.update({
      where: { id },
      data,
    });

    return res.json({
      message: "Author updated",
      author: updated,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteAuthor = async (req, res) => {
  const id = Number(req.params.id);

  const exists = await prisma.author.findFirst({ where: { id } });
  if (!exists) {
    return res.status(404).json({ message: "Author not found" });
  }

  await prisma.author.delete({ where: { id } });

  return res.json({ message: "Author deleted" });
};