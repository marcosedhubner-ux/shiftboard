import { Router } from "express";
import { createServiceTypeSchema, updateServiceTypeSchema } from "./services.schema.js";
import * as servicesService from "./services.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { UnauthorizedError } from "../../domain/errors.js";

export const servicesRouter = Router();

servicesRouter.use(authenticate);

servicesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const serviceTypes = await servicesService.listServiceTypes(req.auth.tenantId);
    res.status(200).json({ serviceTypes });
  })
);

servicesRouter.post(
  "/",
  requireRole("OWNER", "ADMIN"),
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const input = createServiceTypeSchema.parse(req.body);
    const serviceType = await servicesService.createServiceType(input, req.auth.tenantId);
    res.status(201).json({ serviceType });
  })
);

servicesRouter.patch(
  "/:id",
  requireRole("OWNER", "ADMIN"),
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { id } = req.params as { id: string };
    const input = updateServiceTypeSchema.parse(req.body);
    const serviceType = await servicesService.updateServiceType(id, req.auth.tenantId, input);
    res.status(200).json({ serviceType });
  })
);
