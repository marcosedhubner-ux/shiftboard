import type { Server, Socket } from "socket.io";
import { verifyToken } from "../modules/auth/auth.service.js";

let ioInstance: Server | null = null;

function parseCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split("; ").find((entry) => entry.startsWith(`${name}=`));
  return match?.slice(name.length + 1);
}

export function registerRealtimeServer(io: Server): void {
  ioInstance = io;

  io.use((socket: Socket, next) => {
    const token = parseCookie(socket.handshake.headers.cookie, "shiftboard_token");
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }

    try {
      const payload = verifyToken(token);
      socket.data.tenantId = payload.tenantId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.join(`tenant:${socket.data.tenantId}`);
  });
}

export function broadcastToTenant(tenantId: string, event: string, payload: unknown): void {
  if (!ioInstance) return;
  ioInstance.to(`tenant:${tenantId}`).emit(event, payload);
}
