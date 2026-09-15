import { Router } from "express";
import {
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  updateAppointmentStatusSchema,
} from "./appointments.schema.js";
import * as appointmentsService from "./appointments.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { UnauthorizedError } from "../../domain/errors.js";
import { broadcastToTenant } from "../../realtime/socket.js";

export const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

appointmentsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const query = listAppointmentsQuerySchema.parse(req.query);
    const appointments = await appointmentsService.listAppointments(req.auth.tenantId, query.from, query.to);
    res.status(200).json({ appointments });
  })
);

appointmentsRouter.post(
  "/",
  requireRole("OWNER", "ADMIN"),
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const input = createAppointmentSchema.parse(req.body);
    const appointment = await appointmentsService.createAppointment(input, req.auth.tenantId);
    broadcastToTenant(req.auth.tenantId, "appointment:created", appointment);
    res.status(201).json({ appointment });
  })
);

appointmentsRouter.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const { id } = req.params as { id: string };
    const input = updateAppointmentStatusSchema.parse(req.body);
    const appointment = await appointmentsService.updateAppointmentStatus(id, req.auth.tenantId, input, req.auth);
    broadcastToTenant(req.auth.tenantId, "appointment:updated", appointment);
    res.status(200).json({ appointment });
  })
);
