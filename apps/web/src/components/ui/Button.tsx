import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brass text-[#12151b] hover:bg-brass-hover hover:shadow-[0_0_0_1px_rgba(201,161,90,0.45),0_8px_22px_-8px_rgba(201,161,90,0.55)] disabled:bg-brass/35 disabled:text-[#12151b]/50 disabled:shadow-none",
  secondary:
    "bg-surface text-ink ring-1 ring-inset ring-line hover:bg-surface-hover hover:ring-brass/40 hover:shadow-[0_0_18px_-8px_rgba(201,161,90,0.35)]",
  ghost:
    "text-ink-soft hover:bg-surface-hover hover:text-ink hover:shadow-[0_0_14px_-8px_rgba(201,161,90,0.3)]",
  danger:
    "bg-danger text-white hover:bg-danger/85 hover:shadow-[0_0_16px_-6px_rgba(193,85,79,0.5)] disabled:bg-danger/35 disabled:shadow-none",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        "active:scale-[0.98] motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
