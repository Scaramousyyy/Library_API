import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../validators/category.schema.js";

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.json(categories);
};

export const getCategory = async (req, res) => {
  const id = Number(req.params.id);

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.json(category);
};

export const createCategory = async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);

    const exists = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (exists) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const category = await prisma.category.create({ data });

    return res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = categorySchema.parse(req.body);

    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    return res.json({
      message: "Category updated",
      category: updated,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);

  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) {
    return res.status(404).json({ message: "Category not found" });
  }

  await prisma.category.delete({ where: { id } });

  return res.json({ message: "Category deleted" });
};