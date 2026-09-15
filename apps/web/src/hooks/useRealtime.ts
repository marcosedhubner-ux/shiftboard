"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

const REALTIME_EVENTS = ["appointment:created", "appointment:updated"];

export function useRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    };

    for (const event of REALTIME_EVENTS) {
      socket.on(event, handleUpdate);
    }

    return () => {
      for (const event of REALTIME_EVENTS) {
        socket.off(event, handleUpdate);
      }
    };
  }, [queryClient]);
}
