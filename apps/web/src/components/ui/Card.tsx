import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a thin brass top rule — reserve for the one featured/summary card on a view. */
  accent?: boolean;
}

export function Card({ className, accent, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-line bg-surface p-5",
        accent && "border-t-2 border-t-brass",
        className
      )}
      {...props}
    />
  );
}
