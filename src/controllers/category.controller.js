import prisma from '../config/database.js';
import { categorySchema } from "../validators/category.schema.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    return res.json({ data: categories });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ data: category });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);

    const exists = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: { name: data.name },
    });

    return res.status(201).json({
      message: "Category created",
      data: category
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.update({
      where: { id },
      data: { name: data.name },
    });

    return res.json({
      message: "Category updated",
      data: category
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.category.delete({
      where: { id },
    });

    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};