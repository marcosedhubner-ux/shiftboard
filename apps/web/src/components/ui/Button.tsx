import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brass text-[#12151b] hover:bg-brass-hover disabled:bg-brass/35 disabled:text-[#12151b]/50",
  secondary: "bg-surface text-ink ring-1 ring-inset ring-line hover:bg-surface-hover",
  ghost: "text-ink-soft hover:bg-surface-hover",
  danger: "bg-danger text-white hover:bg-danger/85 disabled:bg-danger/35",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
