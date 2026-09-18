import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-neutral-soft text-ink-soft ring-line",
  success: "bg-success-soft text-success-text ring-success/30",
  warning: "bg-warning-soft text-warning-text ring-warning/30",
  danger: "bg-danger-soft text-danger-text ring-danger/30",
  info: "bg-brass-soft text-brass ring-brass/30",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}
