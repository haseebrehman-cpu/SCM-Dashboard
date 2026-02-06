import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

/**
 * Badge Component
 * Used to display status, tags, or labels
 */
const Badge: React.FC<BadgeProps> = React.memo(({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success: "bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400",
    warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400",
    error: "bg-error-50 text-error-700 dark:bg-error-500/20 dark:text-error-400",
    info: "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs font-medium",
    md: "px-3 py-1.5 text-sm font-medium",
    lg: "px-4 py-2 text-base font-medium",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
