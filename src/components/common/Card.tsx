import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * Card Component
 * Reusable card wrapper with consistent styling
 */
const Card: React.FC<CardProps> = React.memo(({
  children,
  className = "",
  hover = false,
  clickable = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm
        dark:border-gray-800 dark:bg-gray-900
        ${hover ? "hover:shadow-theme-md hover:border-gray-300 dark:hover:border-gray-700" : ""}
        ${clickable ? "cursor-pointer transition-all duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
