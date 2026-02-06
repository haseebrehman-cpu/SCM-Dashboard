import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Stat Card Component
 * Displays key metrics with optional trend indicator
 */
const StatCard: React.FC<StatCardProps> = React.memo(({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}) => {
  return (
    <div
      className={`
        rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm
        dark:border-gray-800 dark:bg-gray-900
        transition-all duration-200 hover:shadow-theme-md
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <span
                className={`
                  text-xs font-medium px-2 py-1 rounded
                  ${
                    trend.isPositive
                      ? "bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400"
                      : "bg-error-50 text-error-600 dark:bg-error-500/20 dark:text-error-400"
                  }
                `}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

export default StatCard;
