import React, { ReactNode } from "react";
import Button from "../ui/button/Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionSecondary?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty State Component
 * Displayed when no data is available
 */
const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionSecondary,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 dark:border-gray-700 dark:bg-gray-900">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-400 dark:text-gray-500">{icon}</div>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      {(actionLabel || actionSecondary) && (
        <div className="flex items-center gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {actionSecondary && (
            <Button variant="outline" onClick={actionSecondary.onClick}>
              {actionSecondary.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
