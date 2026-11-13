import { Router } from "express";
import { ActivityStatus, Segment } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import {
  authenticate,
  type AuthRequest,
} from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  entityId: z.string().uuid(),
  segment: z.enum(["B2G", "B2B"]),
  visitDate: z.iso.date(),
});

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const filters = z
      .object({
        segment: z.enum(["B2G", "B2B"]).optional(),
        status: z.enum(["VISITED", "NOT_VISITED"]).optional(),
        from: z.iso.date().optional(),
        to: z.iso.date().optional(),
        search: z.string().optional(),
      })
      .safeParse(req.query);

    if (!filters.success)
      return res.status(400).json({ message: "Invalid query parameters" });
    const { segment, status, from, to, search } = filters.data;

    if (from && to && from > to) {
      return res
        .status(400)
        .json({ message: "Tanggal mulai tidak boleh melewati tanggal akhir" });
    }

    const data = await prisma.activity.findMany({
      where: {
        ...(segment ? { segment: segment as Segment } : {}),
        ...(status ? { status: status as ActivityStatus } : {}),
        ...(from || to
          ? {
              visitDate: {
                ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
                ...(to ? { lte: new Date(`${to}T00:00:00.000Z`) } : {}),
              },
            }
          : {}),
        ...(search
          ? { entity: { name: { contains: search, mode: "insensitive" } } }
          : {}),
        ...(req.user?.role === "SALES" ? { salesId: req.user.id } : {}),
      },
      include: {
        entity: true,
        sales: { select: { id: true, name: true, email: true } },
      },
      orderBy: { visitDate: "desc" },
    });

    return res.json({ data, total: data.length });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({
        message: "Data kunjungan tidak valid",
        errors: parsed.error.flatten(),
      });

    const entity = await prisma.entity.findUnique({
      where: { id: parsed.data.entityId },
    });
    if (!entity)
      return res.status(404).json({ message: "Entitas tidak ditemukan" });
    if (entity.segment !== parsed.data.segment)
      return res
        .status(400)
        .json({ message: "Segmen tidak sesuai dengan entitas" });

    const activity = await prisma.activity.create({
      data: {
        ...parsed.data,
        visitDate: new Date(`${parsed.data.visitDate}T00:00:00.000Z`),
        salesId: req.user!.id,
      },
      include: { entity: true, sales: { select: { id: true, name: true } } },
    });

    return res
      .status(201)
      .json({ message: "Rencana kunjungan berhasil dibuat", data: activity });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req: AuthRequest, res, next) => {
  try {
    const parsed = z
      .object({ status: z.enum(["VISITED", "NOT_VISITED"]) })
      .safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Status tidak valid" });

    const existing = await prisma.activity.findUnique({
      where: { id: String(req.params.id) },
    });
    if (!existing)
      return res.status(404).json({ message: "Kunjungan tidak ditemukan" });
    if (req.user?.role === "SALES" && existing.salesId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Tidak memiliki akses ke kunjungan ini" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const activity = await tx.activity.update({
        where: { id: existing.id },
        data: { status: parsed.data.status },
        include: { entity: true, sales: { select: { id: true, name: true } } },
      });

      if (existing.status !== parsed.data.status) {
        await tx.visitHistory.create({
          data: {
            activityId: existing.id,
            changedBy: req.user!.id,
            oldStatus: existing.status,
            newStatus: parsed.data.status,
          },
        });
      }
      return activity;
    });

    return res.json({
      message: "Status kunjungan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
