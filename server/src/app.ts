import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import entityRoutes from "./modules/entities/entities.routes.js";
import activityRoutes from "./modules/activities/activities.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { authenticate } from "./middlewares/auth.middleware.js";

export const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// API PATH
app.use("/api/auth", authRoutes);
app.use("/api/entity", authenticate, entityRoutes);
app.use("/api/activities", activityRoutes);

app.use(notFound);
app.use(errorHandler);
