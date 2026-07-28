import React from "react";

export function Button({
  children,
  variant = "default",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) {
  let baseStyle =
    "inline-flex items-center justify-center font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer px-4 py-2 rounded-lg";

  if (variant === "ghost") {
    baseStyle += " bg-transparent text-white hover:bg-white/10";
  } else if (variant === "outline") {
    baseStyle += " border border-zinc-700 bg-transparent text-white hover:bg-white/10";
  } else if (variant === "secondary") {
    baseStyle += " bg-zinc-800 text-white hover:bg-zinc-700";
  } else {
    baseStyle += " bg-blue-600 text-white hover:bg-blue-500";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
