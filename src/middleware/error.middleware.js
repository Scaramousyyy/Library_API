export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Prisma unique constraint error
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry",
      errors: err.meta?.target,
    });
  }

  // Prisma not found
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Zod validation error
  if (err.errors) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }

  // Default
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};