import { Router } from "express";
import { inviteStaffSchema } from "./staff.schema.js";
import * as staffService from "./staff.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { UnauthorizedError } from "../../domain/errors.js";

export const staffRouter = Router();

staffRouter.use(authenticate);

staffRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const staff = await staffService.listStaff(req.auth.tenantId);
    res.status(200).json({ staff });
  })
);

staffRouter.post(
  "/",
  requireRole("OWNER", "ADMIN"),
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const input = inviteStaffSchema.parse(req.body);
    const user = await staffService.inviteStaff(input, req.auth);
    res.status(201).json({ user });
  })
);
