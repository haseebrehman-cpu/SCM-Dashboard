import React from "react";

interface DataGridHeaderProps {
  title: string;
}

/**
 * DataGrid header component
 * Follows Single Responsibility Principle - only handles header rendering
 */
export const DataGridHeader: React.FC<DataGridHeaderProps> = React.memo(({ title }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h3>
    </div>
  );
});

DataGridHeader.displayName = "DataGridHeader";
