import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authorRoutes from "./routes/author.routes.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Library API running" });
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

export default app;