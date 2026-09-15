import { Router } from "express";
import { loginSchema, registerTenantSchema } from "./auth.schema.js";
import { getUserById, login, registerTenant } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authRateLimiter } from "../../middlewares/rateLimiters.js";
import { isProduction } from "../../config/env.js";
import { UnauthorizedError } from "../../domain/errors.js";

export const authRouter = Router();

const SESSION_COOKIE = "shiftboard_token";
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

function setSessionCookie(res: import("express").Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

authRouter.post(
  "/register-tenant",
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const input = registerTenantSchema.parse(req.body);
    const { token, user, tenant } = await registerTenant(input);
    setSessionCookie(res, token);
    res.status(201).json({ user, tenant });
  })
);

authRouter.post(
  "/login",
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const { token, user } = await login(input);
    setSessionCookie(res, token);
    res.status(200).json({ user });
  })
);

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.status(204).send();
});

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const user = await getUserById(req.auth.userId);
    res.status(200).json({ user });
  })
);
