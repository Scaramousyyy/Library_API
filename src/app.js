import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authorRoutes from "./routes/author.routes.js";
import bookRoutes from "./routes/book.routes.js";
import bookCopyRoutes from "./routes/bookcopy.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import loggerMiddleware from './middleware/logger.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Library API running" });
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);
app.use("/copies", bookCopyRoutes);
app.use("/loans", loanRoutes);

export default app;