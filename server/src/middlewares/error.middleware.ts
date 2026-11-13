import type { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Endpoint not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
