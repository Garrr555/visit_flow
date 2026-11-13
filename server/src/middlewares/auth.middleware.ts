import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: "ADMIN" | "SALES"; name: string; email: string };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");
    req.user = jwt.verify(token, secret) as AuthRequest["user"];
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorizeAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
}
