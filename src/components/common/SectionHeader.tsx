import React, { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Section Header Component
 * Consistent header for page sections
 */
const SectionHeader: React.FC<SectionHeaderProps> = React.memo(({
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`
        flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
        mb-6 ${className}
      `}
    >
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
