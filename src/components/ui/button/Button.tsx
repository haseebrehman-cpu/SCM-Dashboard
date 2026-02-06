import React, { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

/**
 * Button Component
 * Modern, accessible button with multiple variants and sizes
 */
const Button: React.FC<ButtonProps> = React.memo(({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  fullWidth = false,
}) => {
  // Size Classes
  const sizeClasses = {
    xs: "px-3 py-1.5 text-xs font-medium",
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-5 py-2.5 text-sm font-medium",
    lg: "px-6 py-3 text-base font-medium",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 active:bg-brand-700 disabled:bg-brand-300 disabled:dark:bg-brand-400/40",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 active:bg-gray-100 disabled:dark:bg-gray-900/60 dark:disabled:border-gray-700/50",
    ghost:
      "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700",
    danger:
      "bg-error-500 text-white shadow-theme-xs hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700 active:bg-error-700 disabled:bg-error-300",
    success:
      "bg-success-500 text-white shadow-theme-xs hover:bg-success-600 dark:bg-success-600 dark:hover:bg-success-700 active:bg-success-700 disabled:bg-success-300",
  };

  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        transition-all duration-200 font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500
        dark:focus:ring-offset-gray-900
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-60" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
