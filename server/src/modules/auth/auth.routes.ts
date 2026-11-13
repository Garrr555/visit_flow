import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { authenticate, type AuthRequest } from "../../middlewares/auth.middleware.js";

const router = Router();
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Email atau password tidak valid", errors: parsed.error.flatten() });

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"] }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
