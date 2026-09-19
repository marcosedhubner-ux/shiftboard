import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a thin brass top rule — reserve for the one featured/summary card on a view. */
  accent?: boolean;
  /** Ruled-row hover treatment for clickable/actionable cards: brass left rule fades in with a subtle lift. */
  interactive?: boolean;
}

export function Card({ className, accent, interactive, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg border border-line bg-surface p-5",
        accent && "border-t-2 border-t-brass",
        interactive && [
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-brass",
          "before:opacity-0 before:transition-opacity before:duration-300 before:ease-out motion-reduce:before:transition-none",
          "hover:-translate-y-0.5 hover:border-line hover:shadow-lg hover:shadow-black/20 hover:before:opacity-100",
          "motion-reduce:hover:translate-y-0",
        ],
        className
      )}
      {...props}
    />
  );
}
