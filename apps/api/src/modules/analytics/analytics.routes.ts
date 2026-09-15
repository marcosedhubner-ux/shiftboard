import { Router } from "express";
import { getWeeklySummary } from "./analytics.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { UnauthorizedError } from "../../domain/errors.js";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, requireRole("OWNER", "ADMIN"));

analyticsRouter.get(
  "/weekly-summary",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const summary = await getWeeklySummary(req.auth.tenantId);
    res.status(200).json(summary);
  })
);
