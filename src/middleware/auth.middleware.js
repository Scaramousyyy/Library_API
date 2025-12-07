import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan ke request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};