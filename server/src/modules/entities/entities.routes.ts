import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth.middleware.js";

const router = Router();

const createEntitySchema = z.object({
  name: z.string().trim().min(1, "Nama entity wajib diisi"),
  type: z.string().trim().min(1, "Tipe entity wajib diisi"),
  segment: z.enum(["B2G", "B2B"]),
  region: z.string().trim().min(1, "Region wajib diisi"),
});

router.get("/", authenticate, async (req, res, next) => {
  try {
    const query = z
      .object({
        segment: z.enum(["B2G", "B2B"]).optional(),
        search: z.string().trim().optional(),
      })
      .safeParse(req.query);

    if (!query.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: query.error.flatten(),
      });
    }

    const { segment, search } = query.data;

    const entities = await prisma.entity.findMany({
      where: {
        ...(segment && { segment }),
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ data: entities });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const validation = createEntitySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data entity tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const { name, type, segment, region } = validation.data;

    // Cek entity duplikat
    const existingEntity = await prisma.entity.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        type,
        segment,
      },
    });

    if (existingEntity) {
      return res.status(409).json({
        message:
          "Entity dengan nama, tipe, dan segment tersebut sudah tersedia",
      });
    }

    const entity = await prisma.entity.create({
      data: {
        name,
        type,
        segment,
        region,
      },
    });

    return res.status(201).json({
      message: "Entity berhasil ditambahkan",
      data: entity,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
