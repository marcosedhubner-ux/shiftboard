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

/** Slightly deeper tone + ring on hover, reserved for badges sitting inside interactive rows. */
const toneHoverStyles: Record<BadgeTone, string> = {
  neutral: "hover:bg-[rgba(154,159,172,0.22)] hover:ring-ink-soft/50",
  success: "hover:bg-[rgba(79,157,118,0.26)] hover:ring-success/60",
  warning: "hover:bg-[rgba(189,127,63,0.26)] hover:ring-warning/60",
  danger: "hover:bg-[rgba(193,85,79,0.26)] hover:ring-danger/60",
  info: "hover:bg-[rgba(201,161,90,0.22)] hover:ring-brass/60",
};

export function Badge({
  tone = "neutral",
  interactive,
  children,
}: {
  tone?: BadgeTone;
  /** Enables a smooth hover color shift — use for badges that sit in a clickable/hoverable row. */
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        "transition-colors duration-300 ease-out motion-reduce:transition-none",
        toneStyles[tone],
        interactive && toneHoverStyles[tone]
      )}
    >
      {children}
    </span>
  );
}
